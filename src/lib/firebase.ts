import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Firestore collection references
export const COLLECTIONS = {
  ASSESSMENTS: 'career_assessments',
  COMMUNITY_POSTS: 'community_posts',
  EMPLOYER_LISTINGS: 'employer_listings',
  JOB_POSTINGS: 'job_postings',
  USER_PROFILES: 'user_profiles',
  SAVED_ROADMAPS: 'saved_roadmaps',
  ACTIVITY_LOGS: 'activity_logs'
};
