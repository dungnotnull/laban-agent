import { useEffect } from 'react';
import { Language } from '../types';

interface DynamicSeoProps {
  language: Language;
  activeTab: string;
  currentRole?: string;
}

const TAB_TITLES: Record<Language, Record<string, string>> = {
  vi: {
    suggest: 'Định Hướng Nghề Nghiệp Kỷ Nguyên AI | La Bàn Career Compass',
    resilience: 'Đánh Giá Điểm Kháng AI & O*NET Task Exposure | La Bàn',
    trajectories: 'Mô Phỏng 3 Lộ Trình Chuyển Đổi Nghề Nghiệp | La Bàn',
    roadmap: 'Bản Đồ Kỹ Năng & Lộ Trình Học Tập Tối Ưu Chi Phí | La Bàn',
    research: 'Thư Viện Đối Soát Nghiên Cứu Khoa Học (RAG) | La Bàn',
    news: 'Tin Tức Thị Trường & Biến Động Việc Làm AI Thời Gian Thực | La Bàn',
    jobs: 'Sàn Việc Làm Đón Đầu AI & Cơ Hội Chuyển Đổi | La Bàn',
    community: 'Cộng Đồng Chia Sẻ & Nỗi Niềm Kỷ Nguyên AI | La Bàn',
    employer: 'Cổng Kết Nối Doanh Nghiệp & Nhu Cầu Kỹ Năng AI | La Bàn',
    proof: 'Bảng Minh Chứng & Chỉ Số Đo Lường Tác Động (/proof) | La Bàn'
  },
  en: {
    suggest: 'AI Era Career Orientation & Resilience Radar | La Bàn Career Compass',
    resilience: 'AI Resilience Score & O*NET Task Exposure | La Bàn',
    trajectories: 'Career Trajectory Simulator & 3 Transition Paths | La Bàn',
    roadmap: 'Budget-Aware Skill Roadmap & Learning Milestones | La Bàn',
    research: 'Scientific Research Evidence Base (RAG Library) | La Bàn',
    news: 'Real-Time Labor Market & AI Job Security News | La Bàn',
    jobs: 'AI-Augmented Jobs & Verified Career Opportunities | La Bàn',
    community: 'AI Transition Community & Verified Stories | La Bàn',
    employer: 'Employer Portal & In-Demand AI Skill Needs | La Bàn',
    proof: 'Proof & Impact Telemetry Dashboard (/proof) | La Bàn'
  }
};

const TAB_DESCRIPTIONS: Record<Language, Record<string, string>> = {
  vi: {
    suggest: 'Phân tích điểm kháng AI, mức độ rủi ro tự động hóa và đối soát 20 ngành nghề xu hướng dựa trên O*NET & MOLISA Việt Nam.',
    resilience: 'Phân tích định lượng tỷ lệ phơi nhiễm tự động hóa và tiềm năng khuếch đại AI theo từng tác vụ chuyên môn.',
    trajectories: 'Mô phỏng 3 lộ trình chuyển đổi nghề nghiệp: Giữ vị thế & Nâng cấp AI, Chuyển dịch ngành cận biên, Chuyển đổi toàn diện kèm dự phóng thu nhập 5 năm.',
    roadmap: 'Lộ trình phát triển kỹ năng từng giai đoạn với các tài nguyên học tập miễn phí đã kiểm định và bài kiểm tra tiến độ.',
    research: 'Kho dữ liệu 14 nghiên cứu khoa học phản biện quốc tế (OpenAI, WEF, ILO, Harvard BCG) làm cơ sở đối soát.',
    news: 'Tổng hợp tin tức thị trường lao động và tác động của AI được cập nhật và kiểm chứng thời gian thực.',
    jobs: 'Khám phá các vị trí tuyển dụng có ứng dụng AI thực tế với mức lương và tiêu chuẩn kỹ năng minh bạch tại Việt Nam.',
    community: 'Không gian chia sẻ tâm tư, câu chuyện chuyển đổi thành công và hỗ trợ tâm lý hướng nghiệp giữa làn sóng tự động hóa.',
    employer: 'Đăng tuyển dụng và kết nối ứng viên có năng lực làm chủ công cụ AI và tư duy thích ứng linh hoạt.',
    proof: 'Bảng số liệu kiểm thử thực tế và chỉ số đo lường mức độ tin cậy của thuật toán La Bàn dành cho hội đồng đánh giá.'
  },
  en: {
    suggest: 'Quantitative AI resilience scoring, automation exposure risk, and 20-career radar matrix grounded in O*NET and labor research.',
    resilience: 'Quantitative analysis of automation exposure rate and AI augmentation potential across core occupational tasks.',
    trajectories: 'Simulate 3 actionable career trajectories: Stay & Augment, Pivot Adjacent, or Full Switch with 5-year salary projections.',
    roadmap: 'Step-by-step milestone learning roadmaps featuring verified free learning resources and checkpoint quizzes.',
    research: 'Authoritative evidence base of 14 peer-reviewed research papers (OpenAI, WEF, ILO, Harvard BCG) grounding all career guidance.',
    news: 'Grounded real-time labor market trends and workforce disruption reports in Vietnam and Southeast Asia.',
    jobs: 'Explore verified AI-augmented job postings with competitive salaries and in-demand skills in Vietnam.',
    community: 'Community discussions, verified career pivot stories, and empathetic support in the age of workplace automation.',
    employer: 'Employer portal to list roles and discover talent with proactive AI fluency and agile mindset.',
    proof: 'Real-time telemetry and validation benchmarks proving verifiable accuracy for career guidance.'
  }
};

export function useDynamicSeo({ language, activeTab, currentRole }: DynamicSeoProps) {
  useEffect(() => {
    // 1. Update HTML lang attribute
    document.documentElement.lang = language;

    // 2. Compute dynamic title
    let title = TAB_TITLES[language]?.[activeTab] || 'La Bàn - Agentic AI Career Compass Vietnam';
    if (activeTab === 'suggest' && currentRole && currentRole.trim()) {
      title = language === 'en'
        ? `${currentRole} - AI Resilience & 5Y Forecast | La Bàn`
        : `${currentRole} - Điểm Kháng AI & Dự Báo 5 Năm | La Bàn`;
    }
    document.title = title;

    // 3. Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    const descText = TAB_DESCRIPTIONS[language]?.[activeTab] ||
      (language === 'en'
        ? 'Evidence-grounded career orientation and AI-resilience transition simulator for the workforce in Vietnam.'
        : 'Hệ thống Định hướng Nghề nghiệp & Giả lập Lộ trình Chuyển đổi Kỷ nguyên AI dựa trên dữ liệu chuẩn O*NET & MOLISA.');
    if (metaDesc) {
      metaDesc.setAttribute('content', descText);
    }

    // 4. Update OpenGraph & Twitter title and descriptions
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', descText);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', descText);
  }, [language, activeTab, currentRole]);
}
