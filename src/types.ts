export type ForecastMode = 'optimistic' | 'realistic' | 'conservative' | 'fast' | 'base' | 'slow';
export type AudienceType = 'seeker' | 'changer' | 'employer';
export type Language = 'vi' | 'en';

export interface ResearchSource {
  id: string;
  title: string;
  authors: string;
  institution: string;
  year: number;
  date: string;
  url: string;
  doi?: string;
  keyFindings: string;
  methodology: string;
  automationScope: string;
  vietnamRelevance: string;
}

export interface UserIntakeProfile {
  id?: string;
  fullName?: string;
  currentRole: string;
  experienceYears?: number;
  yearsOfExperience?: number;
  education: string;
  location: string;
  industry?: string;
  currentSkills?: string[];
  interests?: string[];
  personalityTraits?: string[];
  needsPriorities?: {
    salary: number; // 1-5
    stability: number; // 1-5
    meaning: number; // 1-5
    remoteFlexibility: number; // 1-5
    workLifeBalance: number; // 1-5
  };
  strengths?: string[];
  weaknesses?: string[];
  constraints?: {
    budgetVND: number;
    hoursPerWeekAvailable: number;
    preferredLocation?: string;
    riskTolerance: 'low' | 'moderate' | 'high';
  };
  values?: string[];
  workStyle?: string;
  forecastMode: ForecastMode;
}

export interface TaskDecompositionItem {
  taskId: string;
  taskNameVi: string;
  taskNameEn?: string;
  category: 'automated' | 'augmented' | 'human_core' | string;
  exposureRate: number;
  aiToolSubstitutes: string[];
  humanMoatExplanationVi: string;
  humanMoatExplanationEn?: string;
}

export interface TaskAutomationBreakdown {
  taskName: string;
  taskNameEn?: string;
  taskNameVi: string;
  exposureType: 'direct_automation' | 'ai_augmentation' | 'human_core';
  exposurePercentage: number;
  onetCode?: string;
  notes: string;
  notesEn?: string;
}

export interface ResilienceScoreDetail {
  occupationTitle: string;
  occupationTitleVi: string;
  molisaCode?: string;
  molisaCodeEn?: string;
  onetCode?: string;
  overallResilienceScore: number; // 0 - 100
  compositeResilienceScore?: number;
  automationRiskScore?: number;
  exposureRate?: number;
  augmentationPotentialScore?: number;
  augmentationPotential?: number;
  defensibleHumanScore?: number;
  humanAdvantageCore?: string[];
  humanAdvantageCoreEn?: string[];
  taskDecomposition?: TaskDecompositionItem[];
  tasksBreakdown?: TaskAutomationBreakdown[];
  sources?: {
    sourceId: string;
    citationText: string;
    citationTextEn?: string;
    url: string;
  }[];
  methodologySummary?: string;
  methodologySummaryEn?: string;
  uncertaintyRange?: string;
  vietnamDemandSignal?: 'high_growth' | 'stable' | 'declining' | 'transforming';
}

export interface SalaryPoint {
  year: string; // '2026', '2027', etc.
  stayPathSalaryM: number; // in Million VND / month
  pivotPathSalaryM: number;
  switchPathSalaryM: number;
}

export interface TrajectoryPath {
  pathId: 'stay_augment' | 'pivot_adjacent' | 'full_switch' | string;
  pathTitle: string;
  pathTitleVi: string;
  feasibilityScore: number; // 0 - 100
  estimatedTimelineMonths: number;
  shortDescription: string;
  targetRoles: string[];
  skillsToAcquire: string[];
  transferableSkills: string[];
  riskLevel: 'low' | 'moderate' | 'high' | string;
  fiveYearSalaryProjection: number[]; // 5 values in Million VND/month
  rationale: string;
  rationaleEn?: string;
  actionStepNow: string;
  actionStepNowEn?: string;
  shortDescriptionEn?: string;
}

export interface RoadmapMilestone {
  id: string;
  milestoneNumber: number;
  phaseName: string;
  phaseNameVi: string;
  title: string;
  titleVi: string;
  estimatedHours: number;
  weeksDuration: number;
  costTier?: 'free' | 'low_cost' | 'paid';
  estimatedCostVND?: number;
  estimatedCostUSD?: number; // computed post-hoc, never by the LLM
  skillsCovered: string[];
  skillsCoveredEn?: string[];
  freeResources: {
    name: string;
    nameEn?: string;
    provider: string;
    url: string;
    type: 'course' | 'doc' | 'repo' | 'video' | 'book' | 'certification' | 'tutorial' | 'guide';
  }[];
  checkpointQuiz: {
    question: string;
    questionEn?: string;
    options: string[];
    optionsEn?: string[];
    correctIndex: number;
    explanation: string;
    explanationEn?: string;
  };
  isCompleted?: boolean;
}

export interface CareerSuggestion {
  id?: string;
  roleId?: string;
  roleTitle?: string;
  roleTitleVi?: string;
  currentRole?: string;
  onetCode?: string;
  molisaTitleVi?: string;
  vietnamMarketSalaryRange?: string;
  summaryNarrativeVi?: string;
  recommendedPath?: string;
  recommendedPathVi?: string;
  recommendedPathEn?: string;
  transferableSkills?: string[];
  augmentedWithAi?: string[];
  citedResearch?: {
    paperTitle: string;
    institution: string;
    citationSnippetVi: string;
  }[];
  aiResilienceScore?: any; // object or number
  matchScore?: number;
  reasoning?: string;
  reasoningEn?: string;
  whyItFitsYou?: string;
  whyItFitsYouEn?: string;
  transferableSkillsMatch?: string[];
  transferableSkillsMatchEn?: string[];
  skillsGap?: string[];
  skillsGapEn?: string[];
  averageSalaryRangeVND?: string;
  averageSalaryRangeUSD?: string; // computed post-hoc from averageSalaryRangeVND
  evidenceCitations?: {
    paperTitle: string;
    source: string;
    year: number;
    url: string;
    quoteOrDataPoint: string;
  }[];
  resilienceDetail?: ResilienceScoreDetail;
  trajectories?: TrajectoryPath[];
  roadmap?: RoadmapMilestone[];
}

export interface JobSecurityNewsItem {
  id: string;
  title: string;
  titleEn?: string;
  source: string;
  sourceEn?: string;
  publishDate: string;
  url: string;
  summaryVi: string;
  summaryEn: string;
  impactLevel: 'high' | 'medium' | 'low';
  affectedFields: string[];
  affectedFieldsEn?: string[];
  isGrounded?: boolean;
}

export interface JobPostingItem {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryTextVND: string;
  isAiAugmented: boolean;
  requiredSkills: string[];
  summary: string;
  summaryEn?: string;
  applyUrl: string;
  postedDate: string;
  sourceTag: string;
}

export interface CommunityPost {
  id: string;
  authorAlias: string;
  authorAliasEn?: string;
  isAnonymous: boolean;
  userCurrentRole: string;
  userCurrentRoleEn?: string;
  locationName?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  salaryBeforeM?: number;
  salaryAfterM?: number;
  transitionMonths?: number;
  avatarSeed?: string;
  createdAt: string;
  tag: 'fear_of_displacement' | 'career_pivot' | 'learning_burnout' | 'success_story' | 'general_advice' | 'transition_fatigue' | 'seeking_mentor' | 'success_milestone' | 'salary_negotiation' | string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  likesCount: number;
  replies: {
    id: string;
    authorAlias: string;
    authorAliasEn?: string;
    createdAt: string;
    content: string;
    contentEn?: string;
    isVerifiedTransition?: boolean;
    isAiSupportive?: boolean;
  }[];
  distressFlagged?: boolean;
}

export interface GlobalScientificCareerStat {
  id: string;
  rank: number;
  roleVi: string;
  roleEn: string;
  type: 'trending_high_growth' | 'vulnerable_displacement';
  displacementRiskPct: number; // 0 - 100
  growthRatePct: number; // e.g. +35% or -25%
  primarySource: string; // e.g. "WEF Future of Jobs 2025-2026", "Stanford HAI 2025", "ILO Vietnam"
  year: number;
  paperUrl?: string;
  coreExplanationVi: string;
  humanAdvantageFactorVi: string;
  vietnamDemandSignal: 'bùng_nổ' | 'tăng_trưởng' | 'bão_hòa' | 'suy_giảm_mạnh';
}

export interface DailyScientificLaborReport {
  lastUpdated: string;
  reportCycle: string;
  totalOccupationsAnalyzed: number;
  dataSources: string[];
  trendingList: GlobalScientificCareerStat[];
  vulnerableList: GlobalScientificCareerStat[];
  executiveSummaryVi: string;
}

export interface VerifiedTransitionStory {
  id: string;
  seekerName?: string;
  fullName?: string;
  previousRole: string;
  newRole: string;
  companyOrIndustry?: string;
  location?: string;
  transitionDate?: string;
  verifiedBadge?: string;
  salaryIncrease?: string;
  storyQuoteVi?: string;
  keySkillsLearned?: string[];
  timeTakenMonths?: number;
  storyQuote?: string;
  topSkillsAcquired?: string[];
  verifiedDate?: string;
}

export interface EmployerJobListing {
  id: string;
  companyName: string;
  industry: string;
  roleTitle: string;
  location: string;
  aiSkillsDemanded: string[];
  salaryBudgetVND: string;
  description: string;
  contactEmail: string;
  postedDate: string;
  applicantsCount?: number;
}

export interface ProofMetricsData {
  totalUsersServed: number;
  suggestionsGenerated: number;
  trajectoriesSimulated: number;
  roadmapsCreated: number;
  verifiedSuccessfulTransitions: number;
  jobMatchesFacilitated: number;
  communityPostsCount: number;
  employerListingsCount: number;
  citedResearchPapersCount: number;
  averageSalaryIncreasePercent?: number;
  lastUpdated: string;
  benchmarkStats: {
    averageTransitionMonths: number;
    averageSalaryUpliftPercent: number;
    vietnamAIEfficiencyIndex: number;
  };
}
