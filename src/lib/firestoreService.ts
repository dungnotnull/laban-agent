import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  getDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import {
  UserIntakeProfile,
  CareerSuggestion,
  CommunityPost,
  EmployerJobListing,
  JobPostingItem,
  JobSecurityNewsItem,
  ProofMetricsData,
  DailyScientificLaborReport,
  VerifiedTransitionStory
} from '../types';
import { ComprehensiveCareerAnalysisResult } from '../types/careerAnalysis';
import {
  INITIAL_COMMUNITY_POSTS,
  INITIAL_EMPLOYER_LISTINGS,
  INITIAL_JOB_POSTINGS,
  INITIAL_NEWS_ITEMS,
  INITIAL_PROOF_METRICS,
  INITIAL_SCIENTIFIC_LABOR_REPORT,
  VERIFIED_TRANSITION_STORIES
} from '../data/mockData';
import { DEFAULT_CAREER_ANALYSIS } from '../data/defaultCareerAnalysis';

// -------------------------------------------------------------
// 1. SAVE / SYNC USER PROFILE & ASSESSMENT RESULTS IN FIRESTORE
// -------------------------------------------------------------
export async function saveAssessmentToFirestore(
  userId: string,
  intakeProfile: UserIntakeProfile,
  suggestions: CareerSuggestion[],
  comprehensiveAnalysis?: ComprehensiveCareerAnalysisResult | null
) {
  try {
    const userDocRef = doc(db, 'assessments', userId);
    await setDoc(userDocRef, {
      userId,
      intakeProfile,
      suggestions,
      comprehensiveAnalysis: comprehensiveAnalysis || null,
      updatedAt: serverTimestamp(),
      platform: 'LaBan_Web_2026'
    }, { merge: true });
    console.log('[Firestore] Assessment successfully persisted for userId:', userId);
    return true;
  } catch (error) {
    console.warn('[Firestore] Note on assessment persistence:', error);
    return false;
  }
}

export async function getUserAssessmentFromFirestore(userId: string): Promise<{
  intakeProfile?: UserIntakeProfile;
  suggestions?: CareerSuggestion[];
  comprehensiveAnalysis?: ComprehensiveCareerAnalysisResult | null;
} | null> {
  try {
    const userDocRef = doc(db, 'assessments', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as any;
    }
    return null;
  } catch (error) {
    console.warn('[Firestore] Note on assessment retrieval:', error);
    return null;
  }
}

export async function saveUserProfileToFirestore(userId: string, profile: {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  currentRole?: string;
}) {
  try {
    const profileRef = doc(db, 'user_profiles', userId);
    await setDoc(profileRef, {
      ...profile,
      userId,
      lastLoginAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('[Firestore] Note on user profile save:', error);
    return false;
  }
}

// -------------------------------------------------------------
// 2. FETCH OR INITIALIZE COMMUNITY POSTS FROM FIRESTORE
// -------------------------------------------------------------
export async function getFirestoreCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const postsRef = collection(db, 'community_posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Seed initial posts to Firestore only if collection is empty
      for (const post of INITIAL_COMMUNITY_POSTS) {
        await setDoc(doc(db, 'community_posts', post.id), {
          ...post,
          createdAt: post.createdAt || new Date().toISOString()
        });
      }
      return INITIAL_COMMUNITY_POSTS;
    }

    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as CommunityPost[];
  } catch (error) {
    console.warn('[Firestore] Using cached community data:', error);
    return INITIAL_COMMUNITY_POSTS;
  }
}

// -------------------------------------------------------------
// 3. CREATE NEW COMMUNITY POST IN FIRESTORE
// -------------------------------------------------------------
export async function addFirestoreCommunityPost(postData: Omit<CommunityPost, 'id' | 'createdAt' | 'likesCount' | 'replies'>): Promise<CommunityPost> {
  const newPost: CommunityPost = {
    id: `post-${Date.now()}`,
    ...postData,
    createdAt: new Date().toISOString(),
    likesCount: 1,
    replies: []
  };

  try {
    await setDoc(doc(db, 'community_posts', newPost.id), newPost);
  } catch (error) {
    console.warn('[Firestore] Local community fallback:', error);
  }

  return newPost;
}

// -------------------------------------------------------------
// 4. ADD REPLY TO COMMUNITY POST IN FIRESTORE
// -------------------------------------------------------------
export async function addFirestoreReply(postId: string, reply: { authorAlias: string; content: string }) {
  try {
    const postRef = doc(db, 'community_posts', postId);
    const postSnap = await getDoc(postRef);
    const newReplyItem = {
      id: `rep-${Date.now()}`,
      authorAlias: reply.authorAlias,
      createdAt: new Date().toISOString(),
      content: reply.content
    };

    if (postSnap.exists()) {
      const data = postSnap.data() as CommunityPost;
      const updatedReplies = [
        ...(data.replies || []),
        newReplyItem
      ];
      await setDoc(postRef, { replies: updatedReplies }, { merge: true });
    } else {
      const foundMock = INITIAL_COMMUNITY_POSTS.find(p => p.id === postId);
      if (foundMock) {
        await setDoc(postRef, {
          ...foundMock,
          replies: [...(foundMock.replies || []), newReplyItem]
        });
      }
    }
  } catch (error) {
    console.warn('[Firestore] Reply sync error:', error);
  }
}

// -------------------------------------------------------------
// 4b. LIKE COMMUNITY POST IN FIRESTORE
// -------------------------------------------------------------
export async function likeFirestoreCommunityPost(postId: string, delta: number = 1): Promise<number> {
  try {
    const postRef = doc(db, 'community_posts', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      const currentLikes = Number(postSnap.data()?.likesCount) || 0;
      const nextLikes = Math.max(0, currentLikes + delta);
      await setDoc(postRef, { likesCount: nextLikes }, { merge: true });
      return nextLikes;
    } else {
      const foundMock = INITIAL_COMMUNITY_POSTS.find(p => p.id === postId);
      const baseLikes = Math.max(0, (foundMock?.likesCount || 0) + delta);
      if (foundMock) {
        await setDoc(postRef, {
          ...foundMock,
          likesCount: baseLikes
        });
      } else {
        await setDoc(postRef, {
          id: postId,
          likesCount: Math.max(0, delta)
        }, { merge: true });
      }
      return baseLikes;
    }
  } catch (error) {
    console.warn('[Firestore] Like sync error:', error);
    return 0;
  }
}

// -------------------------------------------------------------
// 5. FETCH OR SEED EMPLOYER LISTINGS
// -------------------------------------------------------------
export async function getFirestoreEmployerListings(): Promise<EmployerJobListing[]> {
  try {
    const listingsRef = collection(db, 'employer_listings');
    const snapshot = await getDocs(listingsRef);

    if (snapshot.empty) {
      for (const listing of INITIAL_EMPLOYER_LISTINGS) {
        await setDoc(doc(db, 'employer_listings', listing.id), listing);
      }
      return INITIAL_EMPLOYER_LISTINGS;
    }

    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as EmployerJobListing[];
  } catch (error) {
    console.warn('[Firestore] Using fallback employer listings:', error);
    return INITIAL_EMPLOYER_LISTINGS;
  }
}

// -------------------------------------------------------------
// 6. ADD EMPLOYER LISTING TO FIRESTORE
// -------------------------------------------------------------
export async function addFirestoreEmployerListing(listingData: any): Promise<EmployerJobListing> {
  const newListing: EmployerJobListing = {
    id: `emp-${Date.now()}`,
    ...listingData,
    postedDate: new Date().toISOString().split('T')[0]
  };

  try {
    await setDoc(doc(db, 'employer_listings', newListing.id), newListing);
  } catch (error) {
    console.warn('[Firestore] Local employer listing fallback:', error);
  }

  return newListing;
}

// -------------------------------------------------------------
// 7. GET LIVE NEWS & JOBS WITH FIRESTORE PERSISTENCE
// -------------------------------------------------------------
export async function getFirestoreNews(): Promise<JobSecurityNewsItem[]> {
  try {
    const newsRef = collection(db, 'news_feed');
    const snapshot = await getDocs(newsRef);

    if (snapshot.empty) {
      for (const item of INITIAL_NEWS_ITEMS) {
        await setDoc(doc(db, 'news_feed', item.id), item);
      }
      return INITIAL_NEWS_ITEMS;
    }

    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as JobSecurityNewsItem[];
  } catch (error) {
    return INITIAL_NEWS_ITEMS;
  }
}

// -------------------------------------------------------------
// 8. SCIENTIFIC TOP 20 LABOR REPORT (CRONJOB PERSISTENCE)
// -------------------------------------------------------------
export async function getFirestoreScientificLaborReport(): Promise<DailyScientificLaborReport> {
  try {
    const reportRef = doc(db, 'system_reports', 'top20_scientific_labor_matrix');
    const snap = await getDoc(reportRef);
    if (snap.exists()) {
      return snap.data() as DailyScientificLaborReport;
    }
    // Seed initial report
    await setDoc(reportRef, INITIAL_SCIENTIFIC_LABOR_REPORT);
    return INITIAL_SCIENTIFIC_LABOR_REPORT;
  } catch (err) {
    console.warn('[Firestore] Scientific report local fallback:', err);
    return INITIAL_SCIENTIFIC_LABOR_REPORT;
  }
}

export async function saveFirestoreScientificLaborReport(report: DailyScientificLaborReport): Promise<boolean> {
  try {
    const reportRef = doc(db, 'system_reports', 'top20_scientific_labor_matrix');
    await setDoc(reportRef, {
      ...report,
      lastUpdated: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.warn('[Firestore] Failed to save scientific labor report:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 9. FETCH VERIFIED STORIES
// -------------------------------------------------------------
export async function getFirestoreVerifiedStories(): Promise<VerifiedTransitionStory[]> {
  try {
    const storiesRef = collection(db, 'verified_stories');
    const snapshot = await getDocs(storiesRef);

    if (snapshot.empty) {
      for (const story of VERIFIED_TRANSITION_STORIES) {
        await setDoc(doc(db, 'verified_stories', story.id), story);
      }
      return VERIFIED_TRANSITION_STORIES;
    }

    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as VerifiedTransitionStory[];
  } catch (error) {
    return VERIFIED_TRANSITION_STORIES;
  }
}

// -------------------------------------------------------------
// 10. FETCH PROOF METRICS
// -------------------------------------------------------------
export async function getFirestoreProofMetrics(): Promise<ProofMetricsData> {
  try {
    const metricsRef = doc(db, 'system_reports', 'proof_metrics');
    const snap = await getDoc(metricsRef);
    if (snap.exists()) {
      return snap.data() as ProofMetricsData;
    }
    await setDoc(metricsRef, INITIAL_PROOF_METRICS);
    return INITIAL_PROOF_METRICS;
  } catch (err) {
    return INITIAL_PROOF_METRICS;
  }
}

// -------------------------------------------------------------
// 11. FETCH JOB POSTINGS
// -------------------------------------------------------------
export async function getFirestoreJobPostings(): Promise<JobPostingItem[]> {
  try {
    const jobsRef = collection(db, 'job_postings');
    const snapshot = await getDocs(jobsRef);

    if (snapshot.empty) {
      for (const job of INITIAL_JOB_POSTINGS) {
        await setDoc(doc(db, 'job_postings', job.id), job);
      }
      return INITIAL_JOB_POSTINGS;
    }

    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as JobPostingItem[];
  } catch (error) {
    return INITIAL_JOB_POSTINGS;
  }
}

// -------------------------------------------------------------
// 12. ENSURE INITIAL COMMUNITY POSTS EXIST WITHOUT OVERWRITING
// -------------------------------------------------------------
export async function forceSyncMockCommunityPosts(): Promise<void> {
  try {
    for (const post of INITIAL_COMMUNITY_POSTS) {
      const postRef = doc(db, 'community_posts', post.id);
      const snap = await getDoc(postRef);
      if (!snap.exists()) {
        await setDoc(postRef, {
          ...post,
          createdAt: post.createdAt || new Date().toISOString()
        });
      }
    }
    console.log('[Firestore] Verified community posts in Firestore.');
  } catch (error) {
    console.warn('[Firestore] Failed to verify initial community posts:', error);
  }
}

// -------------------------------------------------------------
// 13. SAVE & GET ROADMAP FOR AUTHENTICATED USER
// -------------------------------------------------------------
export async function saveUserRoadmap(userId: string, roadmapData: any): Promise<boolean> {
  try {
    const roadmapRef = doc(db, 'saved_roadmaps', userId);
    await setDoc(roadmapRef, {
      ...roadmapData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('[Firestore] Failed to save user roadmap:', error);
    return false;
  }
}

export async function getUserRoadmap(userId: string): Promise<any | null> {
  try {
    const roadmapRef = doc(db, 'saved_roadmaps', userId);
    const snap = await getDoc(roadmapRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.warn('[Firestore] Failed to get user roadmap:', error);
    return null;
  }
}
