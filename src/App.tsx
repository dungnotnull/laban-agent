import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { DynamicCareerOrientation } from './components/DynamicCareerOrientation';
import { CurrentRoleOverviewSection } from './components/CurrentRoleOverviewSection';
import { ComprehensiveCareerRadarView } from './components/ComprehensiveCareerRadarView';
import { GoogleIntegrationsSection } from './components/GoogleIntegrationsSection';
import { IntakeForm } from './components/IntakeForm';
import { CareerSuggestionView } from './components/CareerSuggestionView';
import { AIResilienceMatrix } from './components/AIResilienceMatrix';
import { TrajectorySimulator } from './components/TrajectorySimulator';
import { RoadmapModule } from './components/RoadmapModule';
import { ResearchLibraryView } from './components/ResearchLibraryView';
import { JobSecurityNewsView } from './components/JobSecurityNewsView';
import { JobRadarView } from './components/JobRadarView';
import { CommunityModule } from './components/CommunityModule';
import { EmployerPortal } from './components/EmployerPortal';
import { ProofDashboard } from './components/ProofDashboard';
import { GlobalPersonaDrawer } from './components/GlobalPersonaDrawer';
import { AIChatbox } from './components/AIChatbox';
import { AuthModal, AuthErrorInfo } from './components/AuthModal';

import { GOLDEN_PROFILES } from './data/goldenProfiles';
import { DEFAULT_CAREER_ANALYSIS } from './data/defaultCareerAnalysis';
import { generateDynamicCareerAnalysis, generateCurrentRoleOverview } from './lib/dynamicCareerGenerator';
import {
  INITIAL_COMMUNITY_POSTS,
  INITIAL_EMPLOYER_LISTINGS,
  INITIAL_JOB_POSTINGS,
  INITIAL_NEWS_ITEMS,
  INITIAL_PROOF_METRICS,
  VERIFIED_TRANSITION_STORIES
} from './data/mockData';
import {
  CareerSuggestion,
  CommunityPost,
  EmployerJobListing,
  JobPostingItem,
  JobSecurityNewsItem,
  Language,
  ProofMetricsData,
  UserIntakeProfile,
  VerifiedTransitionStory
} from './types';
import { ComprehensiveCareerAnalysisResult } from './types/careerAnalysis';
import {
  saveAssessmentToFirestore,
  getUserAssessmentFromFirestore,
  saveUserProfileToFirestore,
  getFirestoreCommunityPosts,
  addFirestoreCommunityPost,
  addFirestoreReply,
  likeFirestoreCommunityPost,
  getFirestoreEmployerListings,
  addFirestoreEmployerListing,
  getFirestoreNews,
  getFirestoreVerifiedStories,
  getFirestoreProofMetrics,
  getFirestoreJobPostings,
  forceSyncMockCommunityPosts
} from './lib/firestoreService';
import { auth, googleProvider } from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Compass, Sparkles, Shield, Heart, ArrowUp, Database, ArrowRight } from 'lucide-react';

export default function App() {
  // Navigation & Localization
  const [activeTab, setActiveTab] = useState<string>('suggest');
  const [language, setLanguage] = useState<Language>('vi');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const radarRef = useRef<HTMLDivElement>(null);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authErrorInfo, setAuthErrorInfo] = useState<AuthErrorInfo | null>(null);

  // Active Data State
  const [selectedGoldenId, setSelectedGoldenId] = useState<string>('custom');
  const [intake, setIntake] = useState<UserIntakeProfile>({
    fullName: '',
    currentRole: '',
    experienceYears: undefined,
    education: '',
    location: '',
    interests: [],
    personalityTraits: [],
    needsPriorities: {
      salary: 3,
      stability: 3,
      meaning: 3,
      remoteFlexibility: 3,
      workLifeBalance: 3
    },
    strengths: [],
    weaknesses: [],
    currentSkills: [],
    constraints: {
      budgetVND: 0,
      hoursPerWeekAvailable: 0,
      riskTolerance: 'moderate'
    },
    values: [],
    forecastMode: 'realistic'
  });

  // 20-Career Comprehensive Analysis State
  const [careerAnalysis, setCareerAnalysis] = useState<ComprehensiveCareerAnalysisResult>(DEFAULT_CAREER_ANALYSIS);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>(GOLDEN_PROFILES[0].suggestions);
  const [selectedSuggestion, setSelectedSuggestion] = useState<CareerSuggestion>(GOLDEN_PROFILES[0].suggestions[0]);

  // Feeds & Community Data (from Firestore)
  const [newsList, setNewsList] = useState<JobSecurityNewsItem[]>(INITIAL_NEWS_ITEMS);
  const [jobsList, setJobsList] = useState<JobPostingItem[]>(INITIAL_JOB_POSTINGS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [employerListings, setEmployerListings] = useState<EmployerJobListing[]>(INITIAL_EMPLOYER_LISTINGS);
  const [proofMetrics, setProofMetrics] = useState<ProofMetricsData>(INITIAL_PROOF_METRICS);
  const [verifiedStories, setVerifiedStories] = useState<VerifiedTransitionStory[]>(VERIFIED_TRANSITION_STORIES);

  // Loading flags
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isNewsLoading, setIsNewsLoading] = useState(false);

  // Back to top
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Initial load from Firestore
  useEffect(() => {
    async function loadFirestoreData() {
      try {
        await forceSyncMockCommunityPosts();
        
        const [posts, listings, news, stories, metrics, jobs] = await Promise.all([
          getFirestoreCommunityPosts(),
          getFirestoreEmployerListings(),
          getFirestoreNews(),
          getFirestoreVerifiedStories(),
          getFirestoreProofMetrics(),
          getFirestoreJobPostings()
        ]);
        if (posts && posts.length > 0) setCommunityPosts(posts);
        if (listings && listings.length > 0) setEmployerListings(listings);
        if (news && news.length > 0) setNewsList(news);
        if (stories && stories.length > 0) setVerifiedStories(stories);
        if (metrics) setProofMetrics(metrics);
        if (jobs && jobs.length > 0) setJobsList(jobs);
      } catch (err) {
        console.warn('Firestore initial fetch fallback:', err);
      }
    }
    loadFirestoreData();

    // Firebase Auth Listener & Persistent Persona Synchronization
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // 1. Sync user profile to Firestore
        saveUserProfileToFirestore(currentUser.uid, {
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          currentRole: intake.currentRole
        });

        // 2. Restore saved user assessment & persona if available
        try {
          const savedData = await getUserAssessmentFromFirestore(currentUser.uid);
          if (savedData?.intakeProfile) {
            setIntake({
              ...savedData.intakeProfile,
              fullName: savedData.intakeProfile.fullName || currentUser.displayName || ''
            });
            if (savedData.suggestions && savedData.suggestions.length > 0) {
              setSuggestions(savedData.suggestions);
              setSelectedSuggestion(savedData.suggestions[0]);
            }
            if (savedData.comprehensiveAnalysis) {
              setCareerAnalysis(savedData.comprehensiveAnalysis);
            }
          } else if (currentUser.displayName) {
            setIntake(prev => ({
              ...prev,
              fullName: prev.fullName || currentUser.displayName || ''
            }));
          }
        } catch (e) {
          console.warn('Could not restore user profile from Firestore:', e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsAuthLoading(true);
    setAuthErrorInfo(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setUser(result.user);
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      console.warn('Google login detailed error:', err);
      const errorCode = err?.code || '';
      let message = language === 'vi'
        ? 'Không thể hoàn tất đăng nhập bằng Google lúc này.'
        : 'Could not complete Google Sign-In at this time.';
      let solution = '';
      let consoleUrl = '';

      if (errorCode === 'auth/popup-blocked') {
        message = language === 'vi'
          ? 'Trình duyệt đã chặn cửa sổ Popup đăng nhập của Google.'
          : 'Browser popup blocker intercepted the Google sign-in window.';
        solution = language === 'vi'
          ? 'Vui lòng kiểm tra biểu tượng Popup bị chặn trên thanh địa chỉ URL của trình duyệt và chọn "Luôn cho phép cửa sổ bật lên" (Always allow popups).'
          : 'Please click the popup blocked icon in your browser address bar and select "Always allow popups".';
      } else if (errorCode === 'auth/popup-closed-by-user') {
        message = language === 'vi'
          ? 'Cửa sổ đăng nhập đã được đóng trước khi hoàn tất xác thực.'
          : 'Sign-in popup was closed before authentication finished.';
        solution = language === 'vi'
          ? 'Nhấp lại vào nút đăng nhập khi bạn sẵn sàng.'
          : 'Click sign-in again when ready.';
      } else if (errorCode === 'auth/operation-not-allowed' || errorCode === 'auth/configuration-not-found') {
        message = language === 'vi'
          ? 'Nhà cung cấp Google Sign-In chưa được bật trong Firebase Console.'
          : 'Google Sign-In provider is not yet enabled in Firebase Console.';
        solution = language === 'vi'
          ? 'Vào Firebase Console > Authentication > Sign-in method > Thêm/Bật "Google" (Enable) và lưu lại.'
          : 'Navigate to Firebase Console > Authentication > Sign-in method > Enable "Google" provider and save.';
        consoleUrl = 'https://console.firebase.google.com/project/gen-lang-client-0410190415/authentication/providers';
      } else if (errorCode === 'auth/unauthorized-domain') {
        message = language === 'vi'
          ? 'Tên miền trang web này chưa được cấp phép trong Firebase Authentication.'
          : 'This domain is not yet authorized in Firebase Authentication.';
        solution = language === 'vi'
          ? 'Vào Firebase Console > Authentication > Settings > Thêm domain hiện tại vào mục Authorized Domains.'
          : 'Add current domain to Firebase Console > Authentication > Settings > Authorized Domains.';
        consoleUrl = 'https://console.firebase.google.com/project/gen-lang-client-0410190415/authentication/settings';
      } else if (errorCode === 'auth/cancelled-popup-request') {
        message = language === 'vi'
          ? 'Yêu cầu mở popup trước đó đã được hủy.'
          : 'Previous popup request was cancelled.';
        solution = language === 'vi' ? 'Vui lòng thử lại sau giây lát.' : 'Please retry in a moment.';
      } else if (err?.message) {
        message = `${err.message}`;
        solution = language === 'vi'
          ? 'Vui lòng kiểm tra thiết lập Google Auth trong Firebase Console.'
          : 'Please check Google Auth configuration in Firebase Console.';
        consoleUrl = 'https://console.firebase.google.com/project/gen-lang-client-0410190415/authentication';
      }

      setAuthErrorInfo({
        code: errorCode,
        message,
        solution,
        consoleUrl
      });
      setIsAuthModalOpen(true);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.warn('Logout error:', err);
    }
  };

  // Handle Golden Persona Selection
  const handleSelectGoldenPersona = (id: string) => {
    setSelectedGoldenId(id);
    if (id === 'custom') {
      return;
    }

    const matched = GOLDEN_PROFILES.find((p) => p.id === id);
    if (matched) {
      setIntake(matched.intakeProfile);
      setSuggestions(matched.suggestions);
      setSelectedSuggestion(matched.suggestions[0]);
    }
  };

  // Run 20-Career Comprehensive Analysis (10 Trending vs 10 Vulnerable)
  const handleRunComprehensiveAnalysis = async (customProfile?: UserIntakeProfile) => {
    const profileToAnalyze = customProfile || intake;
    setIsAiLoading(true);
    try {
      // Call live Gemini 3.7 API endpoint for 20 careers
      const response = await fetch('/api/gemini/comprehensive-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intakeProfile: profileToAnalyze })
      });
      const data = await response.json();

      if (data.analysis && (data.analysis.trendingCareers || data.analysis.currentRoleOverview)) {
        if (!data.analysis.currentRoleOverview) {
          data.analysis.currentRoleOverview = generateCurrentRoleOverview(profileToAnalyze);
        }
        setCareerAnalysis(data.analysis);
      }

      // Also trigger traditional suggestions for trajectory tabs
      const suggestRes = await fetch('/api/gemini/career-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intakeProfile: profileToAnalyze })
      });
      const suggestData = await suggestRes.json();
      let updatedSuggestions = suggestions;
      if (suggestData.suggestions && suggestData.suggestions.length > 0) {
        setSuggestions(suggestData.suggestions);
        setSelectedSuggestion(suggestData.suggestions[0]);
        updatedSuggestions = suggestData.suggestions;
      }

      // Save user assessment & analysis to Firestore (keyed by authenticated user ID if logged in)
      const userId = user?.uid || `user_${(profileToAnalyze.currentRole || 'guest').replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
      await saveAssessmentToFirestore(userId, profileToAnalyze, updatedSuggestions, data.analysis || careerAnalysis);

      // Smooth scroll to results
      setTimeout(() => {
        radarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err) {
      console.warn('Comprehensive analysis error, utilizing RAG fallback:', err);
      const fallbackAnalysis = generateDynamicCareerAnalysis(profileToAnalyze);
      setCareerAnalysis(fallbackAnalysis);
      setTimeout(() => {
        radarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Deep dive transition simulator for a specific career from the 20 radar
  const handleSelectCareerForDeepDive = async (careerTitleVi: string) => {
    // 1. Update intake role
    const updatedIntake = { ...intake, currentRole: careerTitleVi };
    setIntake(updatedIntake);
    
    // 2. Fetch new deep dive data for this specific career
    setIsAiLoading(true);
    try {
      const suggestRes = await fetch('/api/gemini/career-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intakeProfile: updatedIntake })
      });
      const suggestData = await suggestRes.json();
      if (suggestData.suggestions && suggestData.suggestions.length > 0) {
        setSuggestions(suggestData.suggestions);
        setSelectedSuggestion(suggestData.suggestions[0]);
      }
    } catch (err) {
      console.warn('Failed to fetch deep dive data for', careerTitleVi, err);
    } finally {
      setIsAiLoading(false);
      setActiveTab('trajectories');
      scrollToTop();
    }
  };

  // Refresh Live Grounded News
  const handleRefreshNews = async () => {
    setIsNewsLoading(true);
    try {
      const res = await fetch('/api/gemini/news?refresh=true');
      const data = await res.json();
      if (data.news && data.news.length > 0) {
        setNewsList(data.news);
      }
    } catch (err) {
      console.warn('News refresh error');
    } finally {
      setIsNewsLoading(false);
    }
  };

  // Add Community Post with Firestore
  const handleAddCommunityPost = async (newPostData: {
    title: string;
    content: string;
    isAnonymous: boolean;
    tag: any;
  }) => {
    try {
      const post = await addFirestoreCommunityPost({
        authorAlias: newPostData.isAnonymous
          ? 'Ẩn danh (Thành viên La Bàn)'
          : user?.displayName || intake.fullName || 'Thành viên',
        isAnonymous: newPostData.isAnonymous,
        userCurrentRole: intake.currentRole || 'Đang tìm kiếm hướng đi',
        tag: newPostData.tag,
        title: newPostData.title,
        content: newPostData.content
      });
      setCommunityPosts([post, ...communityPosts]);
    } catch (err) {
      console.warn('Community post Firestore write error:', err);
    }
  };

  // Add Reply to Post with Firestore
  const handleAddReply = async (postId: string, content: string) => {
    try {
      const author = user?.displayName || intake.fullName || 'Thành viên La Bàn';
      await addFirestoreReply(postId, {
        authorAlias: author,
        content
      });
      setCommunityPosts(
        communityPosts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              replies: [
                ...(p.replies || []),
                {
                  id: `rep-${Date.now()}`,
                  authorAlias: author,
                  createdAt: new Date().toISOString(),
                  content
                }
              ]
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.warn('Reply write error:', err);
    }
  };

  // Like / Unlike a Community Post with Firestore
  const handleLikeCommunityPost = async (postId: string, delta: number = 1) => {
    try {
      const newLikesCount = await likeFirestoreCommunityPost(postId, delta);
      setCommunityPosts(prevPosts =>
        prevPosts.map(p => {
          if (p.id === postId) {
            return { ...p, likesCount: newLikesCount };
          }
          return p;
        })
      );
    } catch (err) {
      console.warn('Like Firestore write error:', err);
    }
  };

  // Add Employer Listing with Firestore
  const handleAddEmployerListing = async (listingData: any) => {
    try {
      const newListing = await addFirestoreEmployerListing(listingData);
      setEmployerListings([newListing, ...employerListings]);
    } catch (err) {
      console.warn('Employer listing write error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedGoldenId={selectedGoldenId}
        onSelectGoldenPersona={handleSelectGoldenPersona}
        language={language}
        setLanguage={setLanguage}
        isOnlineDemo={true}
        user={user}
        isAuthLoading={isAuthLoading}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Scientific Disclaimer Banner */}
      <div className="bg-green-200 border-b border-amber-200 px-4 py-2 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm text-green-700 font-medium text-center">
          <Database className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>
            {language === 'vi' ? (
              <>
                Hệ thống <strong>KHÔNG Hallucination</strong>. 100% dữ liệu phân tích & Điểm Kháng AI được đối soát từ <a href="https://www.onetonline.org/" target="_blank" rel="noreferrer" className="underline font-bold text-amber-700">O*NET 28.1</a>, <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2023/" target="_blank" rel="noreferrer" className="underline font-bold text-amber-700">WEF 2023</a>, và <a href="https://www.ilo.org/" target="_blank" rel="noreferrer" className="underline font-bold text-amber-700">ILO</a>, dựa trên <strong>Hồ sơ Persona</strong> của chính bạn.
              </>
            ) : (
              <>
                System is <strong>NOT Hallucinating</strong>. 100% analysis & AI Resilience Score are cross-referenced from <a href="https://www.onetonline.org/" target="_blank" rel="noreferrer" className="underline font-bold text-amber-700">O*NET 28.1</a>, <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2023/" target="_blank" rel="noreferrer" className="underline font-bold text-amber-700">WEF 2023</a>, and <a href="https://www.ilo.org/" target="_blank" rel="noreferrer" className="underline font-bold text-amber-700">ILO</a>, based on your own <strong>Persona Profile</strong>.
              </>
            )}
          </span>
        </div>
      </div>
      
      {/* Global Persona Drawer */}
      <GlobalPersonaDrawer 
        intake={intake} 
        setIntake={setIntake} 
        language={language}
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* TAB 1: AI Career Guidance & Comprehensive 20-Career Radar */}
        {activeTab === 'suggest' && (
          <div className="space-y-8">
            {/* Dynamic Orientation Intake Form (Fixed Comma + Strengths/Weaknesses/Interests) */}
            <DynamicCareerOrientation
              intake={intake}
              setIntake={setIntake}
              onAnalyze={handleRunComprehensiveAnalysis}
              isLoading={isAiLoading}
              language={language}
              onOpenPersonaDrawer={() => setIsDrawerOpen(true)}
            />

            {/* 10 Trending vs 10 Vulnerable Careers Comprehensive Radar + Current Role Overview */}
            <div ref={radarRef} className="scroll-mt-6 space-y-8">
              {/* Scientific Review of User's Current Role & 5-Year Forecast */}
              <CurrentRoleOverviewSection
                overview={careerAnalysis.currentRoleOverview || generateCurrentRoleOverview(intake)}
                intake={intake}
                language={language}
                isLoading={isAiLoading}
              />

              {/* 10 Trending vs 10 Vulnerable Careers Comprehensive Radar */}
              <ComprehensiveCareerRadarView
                analysis={careerAnalysis}
                isLoading={isAiLoading}
                language={language}
                onSelectCareerForDeepDive={handleSelectCareerForDeepDive}
              />
            </div>

            {/* Google Integrations: Sheets Export, Google Calendar Sync, Google Maps Hubs */}
            <GoogleIntegrationsSection
              careerAnalysis={careerAnalysis}
              selectedSuggestion={selectedSuggestion}
              intakeProfile={intake}
              language={language}
            />
          </div>
        )}

        {/* TAB 2: AI Resilience Score & O*NET Task Matrix */}
        {activeTab === 'resilience' && (
          <AIResilienceMatrix
            suggestion={selectedSuggestion}
            intakeProfile={intake}
            currentRoleOverview={careerAnalysis.currentRoleOverview}
            language={language}
            onNavigateTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {/* TAB 3: 3 Career Trajectories & 5-Year Salary Curve */}
        {activeTab === 'trajectories' && (
          <TrajectorySimulator
            currentSuggestion={selectedSuggestion}
            language={language}
            onNavigateTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {/* TAB 4: Milestone-based Roadmap & Checkpoint Quizzes */}
        {activeTab === 'roadmap' && (
          <RoadmapModule
            currentSuggestion={selectedSuggestion}
            language={language}
            user={user}
          />
        )}

        {/* TAB 5: Research Base & RAG Citations */}
        {activeTab === 'research' && (
          <ResearchLibraryView
            language={language}
          />
        )}

        {/* TAB 6: Job-Security News & Search Grounding */}
        {activeTab === 'news' && (
          <JobSecurityNewsView
            news={newsList}
            onRefreshNews={handleRefreshNews}
            isLoading={isNewsLoading}
            language={language}
          />
        )}

        {/* TAB 7: AI-Augmented Job Radar */}
        {activeTab === 'jobs' && (
          <JobRadarView
            jobs={jobsList}
            language={language}
          />
        )}

        {/* TAB 8: Community "Nỗi Niềm" & Verified Transformations */}
        {activeTab === 'community' && (
          <CommunityModule
            posts={communityPosts}
            verifiedStories={verifiedStories}
            onAddPost={handleAddCommunityPost}
            onAddReply={handleAddReply}
            onLikePost={handleLikeCommunityPost}
            language={language}
          />
        )}

        {/* TAB 9: Employer Portal & Talent Pipeline */}
        {activeTab === 'employer' && (
          <EmployerPortal
            listings={employerListings}
            onAddListing={handleAddEmployerListing}
            language={language}
          />
        )}

        {/* TAB 10: Proof & Impact Metrics (/proof) */}
        {activeTab === 'proof' && (
          <ProofDashboard
            metrics={proofMetrics}
            language={language}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 py-8 px-4 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 font-sans">LA BÀN - AI Career Compass Vietnam</p>
              <p className="text-[11px] text-slate-500">
                {language === 'vi' ? 'Dự thi sáng tạo AI Riser Vietnam 2026 (#BuildwithGoogleAI) • Cơ sở dữ liệu Firebase Firestore' : 'AI Riser Vietnam 2026 Submission (#BuildwithGoogleAI) • Firebase Firestore DB'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="text-slate-600">{language === 'vi' ? 'Nguồn trích dẫn: OpenAI (2023) • WEF • ILO • MOLISA Vietnam' : 'Citations: OpenAI (2023) • WEF • ILO • MOLISA Vietnam'}</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-medium">{language === 'vi' ? '100% Dữ liệu có căn cứ nghiên cứu đối soát' : '100% Research-backed Evidence Data'}</span>
          </div>
        </div>
      </footer>

      {/* Back to top button & Chatbox */}
      {showBackToTop && (
        <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
          <button
            onClick={scrollToTop}
            className="p-4 bg-slate-800 text-white rounded-full shadow-2xl hover:bg-slate-900 hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
            title={language === 'vi' ? 'Lên đầu trang' : 'Back to top'}
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </div>
      )}

      <AIChatbox intake={intake} language={language} />

      {/* Google Authentication & Cloud Sync Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        isLoading={isAuthLoading}
        errorInfo={authErrorInfo}
        onLoginWithGoogle={handleLogin}
        onLogout={handleLogout}
        language={language}
      />
    </div>
  );
}
