// Curated registry of real, publicly accessible learning resources for the
// actionability layer. Every URL was HTTP-verified (200/301) at curation
// time (2026-10-13). Entries are the ONLY freeResources URLs the analyst
// may emit; the verifier grounds URLs against this registry exactly like
// citations against the research corpus.

export interface LearningResource {
  id: string;
  name: string;
  provider: string;
  url: string;
  type: 'course' | 'certification' | 'tutorial' | 'guide';
  costTier: 'free' | 'low_cost' | 'paid';
  language: 'vi' | 'en' | 'vi_en';
  notes?: string;
}

export const LEARNING_RESOURCES: LearningResource[] = [
  { id: 'google-ai-essentials', name: 'Google AI Essentials', provider: 'Google', url: 'https://grow.google/ai-essentials/', type: 'course', costTier: 'low_cost', language: 'en', notes: 'Scholarships periodically offered via Google and partners' },
  { id: 'learnprompting', name: 'Learn Prompting (open guide)', provider: 'Learn Prompting', url: 'https://learnprompting.org/', type: 'guide', costTier: 'free', language: 'en' },
  { id: 'ms-learn-vi', name: 'Microsoft Learn (Vietnamese)', provider: 'Microsoft', url: 'https://learn.microsoft.com/vi-vn/training/', type: 'course', costTier: 'free', language: 'vi' },
  { id: 'freecodecamp', name: 'freeCodeCamp full curriculum', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn', type: 'certification', costTier: 'free', language: 'en' },
  { id: 'w3schools', name: 'W3Schools tutorials', provider: 'W3Schools', url: 'https://www.w3schools.com', type: 'tutorial', costTier: 'free', language: 'en' },
  { id: 'khan-academy', name: 'Khan Academy', provider: 'Khan Academy', url: 'https://www.khanacademy.org', type: 'course', costTier: 'free', language: 'en' },
  { id: 'gcfglobal', name: 'GCFLearnFree digital literacy basics', provider: 'GCFGlobal', url: 'https://edu.gcfglobal.org/en/', type: 'tutorial', costTier: 'free', language: 'en', notes: 'Basic computer, internet and office skills' },
  { id: 'cs50', name: 'CS50x Introduction to Computer Science', provider: 'Harvard', url: 'https://cs50.harvard.edu/x/', type: 'course', costTier: 'free', language: 'en' },
  { id: 'duolingo', name: 'Duolingo (English for Vietnamese speakers)', provider: 'Duolingo', url: 'https://www.duolingo.com', type: 'course', costTier: 'free', language: 'vi_en', notes: 'Free tier sufficient for daily practice' },
  { id: 'coursera-google-certificates', name: 'Google Career Certificates', provider: 'Google / Coursera', url: 'https://www.coursera.org/google-career-certificates', type: 'certification', costTier: 'low_cost', language: 'en', notes: 'Coursera financial aid available; audit is free' },
  { id: 'edx-audit', name: 'edX course audit tracks', provider: 'edX', url: 'https://www.edx.org', type: 'course', costTier: 'free', language: 'en', notes: 'Audit track is free; certificates are paid' },
  { id: 'alison', name: 'Alison free courses & diplomas', provider: 'Alison', url: 'https://alison.com', type: 'course', costTier: 'free', language: 'en' },
  { id: 'aws-skill-builder', name: 'AWS Skill Builder (free tier)', provider: 'AWS', url: 'https://skillbuilder.aws', type: 'course', costTier: 'free', language: 'en' },
  { id: 'kaggle-learn', name: 'Kaggle Learn micro-courses', provider: 'Kaggle', url: 'https://www.kaggle.com/learn', type: 'tutorial', costTier: 'free', language: 'en' },
  { id: 'topdev-blog', name: 'TopDev Blog career guides (CV, interview, tech careers)', provider: 'TopDev', url: 'https://topdev.vn/blog', type: 'guide', costTier: 'free', language: 'vi', notes: 'Replaces TopCV guides, which block non-browser traffic (403)' },
  { id: 'vietnamworks-careers', name: 'VietnamWorks career articles & job board', provider: 'VietnamWorks', url: 'https://www.vietnamworks.com', type: 'guide', costTier: 'free', language: 'vi_en' }
];

export const LEARNING_RESOURCE_URLS: Set<string> = new Set(LEARNING_RESOURCES.map(r => r.url));
