export interface CitedResearchEvidence {
  paperTitle: string;
  institution: string;
  year: number;
  keyMetricOrFormula: string;
  keyMetricOrFormulaEn?: string;
  url: string;
}

export interface CurrentRoleTaskImpact {
  taskNameVi: string;
  taskNameEn?: string;
  taskType: 'Routine Cognitive' | 'Routine Manual' | 'Non-routine Analytical' | 'Interpersonal / Strategic';
  impactTimeline: string;
  impactTimelineEn?: string;
  replacementProbability: number; // 0-100%
  aiTechnology: string;
  aiTechnologyEn?: string;
}

export interface CurrentRoleOverviewAssessment {
  currentRole: string;
  experienceYears?: number;
  evaluatedAt?: string;
  
  // Quantitative Metrics: Current vs 5-Year Outlook
  currentResilienceScore: number; // 0-100 (Điểm Kháng AI Hiện Tại)
  future5YResilienceScore: number; // 0-100 (Điểm Kháng AI 5 Năm Tới)
  
  currentLaborDemandIndex: number; // 0-100 (Chỉ số Cung/Cầu Hiện Tại)
  future5YLaborDemandIndex: number; // 0-100 (Chỉ số Cung/Cầu 5 Năm Tới)
  
  currentRiskScore: number; // 0-100 (Mức độ Rủi ro Hiện Tại: 0-30 Thấp, 31-60 Trung bình, 61-100 Cao)
  future5YRiskScore: number; // 0-100 (Mức độ Rủi ro 5 Năm Tới)
  
  automationExposureRate: number; // Tỷ lệ phơi nhiễm tự động hóa % (O*NET / OpenAI)
  augmentationPotentialRate: number; // Tiềm năng khuếch đại AI % (ILO / Harvard BCG)
  fiveYearDemandGrowthPct: string; // e.g. "+35% (AI-Augmented) / -28% (Traditional)"
  fiveYearDemandGrowthPctEn?: string;
  
  // Qualitative Scientific Synthesis
  overviewCurrentStateVi: string; // Nhận xét tổng quan ngành nghề hiện tại
  overviewCurrentStateEn?: string;
  fiveYearForecastVi: string; // Dự báo 5 năm tới (2026-2031)
  fiveYearForecastEn?: string;
  
  // Task level breakdown
  tasksAtRisk: CurrentRoleTaskImpact[];
  humanMoatCapabilities: string[]; // Năng lực con người khó bị thay thế
  humanMoatCapabilitiesEn?: string[];
  strategicUpskillingDirectionVi: string; // Hướng phát triển nâng cấp năng lực
  strategicUpskillingDirectionEn?: string;
  
  // Anti-Hallucination Citations Note
  citedEvidenceSources: CitedResearchEvidence[];
}

export interface CareerAnalysisItem {
  id: string;
  rank: number;
  title: string;
  titleVi: string;
  category: 'trending' | 'vulnerable';
  resilienceScore: number; // 0-100
  automationExposure: number; // 0-100%
  laborDemandIndex?: number; // 0-100% (Chỉ số cung cầu lao động)
  demandGrowthRate: string; // e.g. "+38% (2024-2028)" or "-24% (2024-2028)"
  averageSalaryVND: string; // e.g. "30,000,000 - 55,000,000 VND"
  averageSalaryVNDEn?: string;
  whyTrendingOrVulnerable: string;
  whyTrendingOrVulnerableEn?: string;
  keySkillsRequiredOrAtRisk: string[];
  keySkillsRequiredOrAtRiskEn?: string[];
  humanMoatFactor: string;
  humanMoatFactorEn?: string;
  citedResearchPaper: {
    title: string;
    institution: string;
    year: number;
    quoteOrKeyFinding: string;
    quoteOrKeyFindingEn?: string;
  };
  transitionAdvice: string;
  transitionAdviceEn?: string;
}

export interface ComprehensiveCareerAnalysisResult {
  candidateProfileSummary: {
    strengths: string[];
    strengthsEn?: string[];
    weaknesses: string[];
    weaknessesEn?: string[];
    interests: string[];
    interestsEn?: string[];
    currentSkills: string[];
    currentSkillsEn?: string[];
    currentRole: string;
  };
  currentRoleOverview?: CurrentRoleOverviewAssessment;
  trendingCareers: CareerAnalysisItem[]; // 10 careers
  vulnerableCareers: CareerAnalysisItem[]; // 10 careers
  strategicTakeawaysVi: string;
  strategicTakeawaysEn?: string;
  academicMethodologyBasis: string;
  academicMethodologyBasisEn?: string;
}
