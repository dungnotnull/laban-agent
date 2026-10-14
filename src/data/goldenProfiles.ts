import { CareerSuggestion, UserIntakeProfile } from '../types';
import { VIETNAM_OCCUPATIONS_DATABASE } from './vietnamOccupations';

export interface GoldenPersona {
  id: string;
  name: string;
  nameVi: string;
  currentRole: string;
  avatarSeed: string;
  summaryQuote: string;
  intakeProfile: UserIntakeProfile;
  suggestions: CareerSuggestion[];
}

export const GOLDEN_PROFILES: GoldenPersona[] = [
  {
    id: 'persona-thao-designer',
    name: 'Lê Minh Thảo',
    nameVi: 'Lê Minh Thảo (TP. Hồ Chí Minh)',
    currentRole: 'Junior Graphic Designer (2.5 năm kinh nghiệm)',
    avatarSeed: 'Thao',
    summaryQuote: 'Thấy Midjourney v6 và Canva AI tạo banner chỉ trong 10 giây, em lo 2 năm nữa thị trường freelancer và agency không còn chỗ cho 2D designer truyền thống.',
    intakeProfile: {
      fullName: 'Lê Minh Thảo',
      currentRole: 'Graphic Designer',
      experienceYears: 2.5,
      education: 'Cử nhân Thiết kế Đồ họa (Đại học Kiến Trúc TP.HCM)',
      location: 'TP. Hồ Chí Minh',
      interests: ['Visual Design', 'UI/UX', 'AI Art Direction', 'Branding', 'Photography'],
      personalityTraits: ['Sáng tạo', 'Tỉ mỉ', 'Thích quan sát xu hướng', 'Trực giác thẩm mỹ cao'],
      needsPriorities: {
        salary: 4,
        stability: 4,
        meaning: 5,
        remoteFlexibility: 4,
        workLifeBalance: 3
      },
      strengths: ['Adobe Creative Suite (Photoshop, Illustrator)', 'Cảm quan màu sắc & bố cục', 'Lắng nghe brief khách hàng', 'Thấu cảm thương hiệu'],
      weaknesses: ['Chưa biết lập trình giao diện', 'Chưa có quy trình kiểm soát prompt AI nâng cao', 'Ngại số liệu định lượng'],
      constraints: {
        budgetVND: 2500000,
        hoursPerWeekAvailable: 12,
        preferredLocation: 'TP. Hồ Chí Minh / Hybrid',
        riskTolerance: 'moderate'
      },
      values: ['Tính sáng tạo độc bản', 'Sự công nhận nghề nghiệp', 'Thu nhập bền vững theo năng lực'],
      workStyle: 'Làm việc theo dự án linh hoạt, thích môi trường agency năng động hoặc product studio',
      forecastMode: 'realistic'
    },
    suggestions: [
      {
        id: 'sug-thao-1',
        roleTitle: 'AI Art Director & Brand Narrative Specialist',
        roleTitleVi: 'Giám đốc Mỹ thuật Ứng dụng AI & Kể chuyện Thương hiệu',
        aiResilienceScore: 84,
        matchScore: 92,
        reasoning: 'Tận dụng trực giác thẩm mỹ và năng lực định hướng thị giác sẵn có để chuyển từ "người vẽ thuê từng chi tiết" sang "nhạc trưởng điều phối luồng sáng tạo AI" cho chiến dịch đa kênh.',
        reasoningEn: 'Leverage your existing aesthetic intuition and visual direction skills to move from "per-detail illustrator" to "conductor of AI creative pipelines" for multi-channel campaigns.',
        whyItFitsYou: 'Bạn có nền tảng học thuật thiết kế vững chắc (Arch Uni), điều mà người dùng AI phong trào thiếu. Kết hợp năng lực curation thẩm mỹ với khả năng kiểm soát prompt và design system sẽ đưa bạn lên vị trí quản lý sáng tạo.',
        whyItFitsYouEn: 'You have a solid academic design foundation (Architecture University) that casual AI users lack. Combining aesthetic curation with prompt control and design systems will position you for creative leadership.',
        transferableSkillsMatch: ['Bố cục thị giác & Color theory', 'Thấu hiểu brand guidelines', 'Kỹ năng làm việc với Art Director', 'Kể chuyện bằng hình ảnh'],
        transferableSkillsMatchEn: ['Visual composition & color theory', 'Brand guidelines understanding', 'Art Director collaboration skills', 'Visual storytelling'],
        skillsGap: ['Kỹ thuật Prompting & Inpainting chuyên sâu (Midjourney, ComfyUI, ControlNet)', 'Quản lý dự án sáng tạo AI (AI Creative Workflow)', 'Xây dựng Design System quy chuẩn cho Product'],
        skillsGapEn: ['Advanced Prompting & Inpainting (Midjourney, ComfyUI, ControlNet)', 'AI creative project management (AI Creative Workflow)', 'Building standardized Design Systems for Products'],
        averageSalaryRangeVND: '22,000,000 - 45,000,000 VND / tháng',
        evidenceCitations: [
          {
            paperTitle: 'GPTs are GPTs: An Early Look at the Labor Market Impact Potential of LLMs',
            source: 'OpenAI / University of Pennsylvania',
            year: 2023,
            url: 'https://arxiv.org/abs/2303.10130',
            quoteOrDataPoint: 'About 80% of the U.S. workforce could see at least 10% of work tasks affected by LLMs; about 19% could see at least 50% of tasks affected, with higher exposure in higher-wage jobs.'
          },
          {
            paperTitle: 'Báo cáo Thị trường Tuyển dụng 2024 - 2025 (TopCV)',
            source: 'TopCV Việt Nam',
            year: 2024,
            url: 'https://insights.topcv.vn/recruitment-report-2024-2025',
            quoteOrDataPoint: 'Báo cáo thường niên lần thứ 5 của TopCV, phân tích gần 300.000 tin đăng tuyển dụng, tập trung tác động của AI và chuyển đổi số lên kỹ năng và chân dung nhân tài số.'
          }
        ],
        resilienceDetail: VIETNAM_OCCUPATIONS_DATABASE['graphic-designer'],
        trajectories: [
          {
            pathId: 'stay_augment',
            pathTitle: 'Stay & Become AI Art Director',
            pathTitleVi: 'Ở lại ngành Sáng tạo & Lên Giám đốc Mỹ thuật Ứng dụng AI',
            feasibilityScore: 88,
            estimatedTimelineMonths: 4,
            shortDescription: 'Nâng cấp quy trình thiết kế hiện tại: làm chủ ComfyUI, ControlNet, Photoshop Firefly để tăng tốc độ ra concept gấp 5 lần và giữ vai trò Art Lead.',
            shortDescriptionEn: 'Upgrade your current design workflow: master ComfyUI, ControlNet, and Photoshop Firefly to speed up concept generation 5x while keeping the Art Lead role.',
            targetRoles: ['Senior Graphic & AI Specialist', 'Associate Art Director', 'Creative Lead'],
            skillsToAcquire: ['ComfyUI & ControlNet parameters', 'Adobe Firefly Advanced Workflow', 'Creative Concept Pitching'],
            transferableSkills: ['Màu sắc, Typography, Brand Empathy'],
            riskLevel: 'low',
            fiveYearSalaryProjection: [14, 20, 28, 36, 45],
            rationale: 'Rủi ro thấp nhất vì bạn phát huy 100% kinh nghiệm thẩm mỹ sẵn có và gia tăng năng suất vượt trội.',
            rationaleEn: 'Lowest risk since you fully leverage your existing aesthetic experience with exceptional productivity gains.',
            actionStepNow: 'Thực hành tạo 1 bộ nhận diện thương hiệu hoàn chỉnh phối hợp ComfyUI + Illustrator trong tuần này.',
            actionStepNowEn: 'Practice creating a complete brand identity combining ComfyUI + Illustrator this week.'
          },
          {
            pathId: 'pivot_adjacent',
            pathTitle: 'Pivot to UI/UX Product Designer with AI',
            pathTitleVi: 'Chuyển nhánh sang Thiết kế Trải nghiệm Sản phẩm (UI/UX Product Design)',
            feasibilityScore: 78,
            estimatedTimelineMonths: 6,
            shortDescription: 'Chuyển dịch sang mảng thiết kế sản phẩm số (App/Web UI/UX), nơi bài toán tập trung vào luồng người dùng, tâm lý học hành vi và kiến trúc thông tin.',
            shortDescriptionEn: 'Shift into digital product design (App/Web UI/UX), where the problems center on user flows, behavioral psychology, and information architecture.',
            targetRoles: ['UI/UX Designer', 'Product Designer', 'AI Interaction Designer'],
            skillsToAcquire: ['Figma & Component Auto-layout', 'User Research & Usability Testing', 'AI-assisted Rapid Wireframing'],
            transferableSkills: ['Visual hierarchy, Thiết kế icon, Cảm quan giao diện'],
            riskLevel: 'moderate',
            fiveYearSalaryProjection: [14, 22, 32, 42, 55],
            rationale: 'Thị trường Tech Product tại VN có nhu cầu tuyển UI/UX ổn định với khung lương cao hơn agency quảng cáo.',
            rationaleEn: "Vietnam's tech product market has stable UI/UX hiring demand with higher salary bands than advertising agencies.",
            actionStepNow: 'Hoàn thành 1 case study thiết kế Redesign ứng dụng di động có áp dụng AI wireframing trong Figma.',
            actionStepNowEn: 'Complete one mobile app redesign case study applying AI wireframing in Figma.'
          },
          {
            pathId: 'full_switch',
            pathTitle: 'Full Switch to 3D & Spatial Interaction Design',
            pathTitleVi: 'Chuyển hẳn sang Thiết kế Không gian & Tương tác 3D (Spatial Design)',
            feasibilityScore: 55,
            estimatedTimelineMonths: 12,
            shortDescription: 'Đầu tư học Blender, Unreal Engine, Spline để bước vào lĩnh vực thiết kế 3D, game asset và giao diện AR/VR.',
            shortDescriptionEn: 'Invest in learning Blender, Unreal Engine, and Spline to enter 3D design, game assets, and AR/VR interfaces.',
            targetRoles: ['3D Motion Designer', 'Spatial Experience Designer', 'Game Asset Artist'],
            skillsToAcquire: ['Blender 3D Modeling & Shader', 'Spline 3D Web Integration', 'Unreal Engine basics'],
            transferableSkills: ['Tư duy thẩm mỹ, ánh sáng, chất liệu'],
            riskLevel: 'high',
            fiveYearSalaryProjection: [14, 18, 30, 48, 65],
            rationale: 'Đường cong học tập dốc (12 tháng), đòi hỏi cấu hình máy tính mạnh, nhưng ít bị cạnh tranh bởi AI đại trà.',
            rationaleEn: 'Steep learning curve (12 months) and demanding hardware, but far less exposed to mass-market AI competition.',
            actionStepNow: 'Cài đặt Blender và hoàn thành khóa học căn bản Donut tutorial trong 2 tuần.',
            actionStepNowEn: 'Install Blender and complete the beginner Donut tutorial within 2 weeks.'
          }
        ],
        roadmap: [
          {
            id: 'thao-m1',
            milestoneNumber: 1,
            phaseName: 'Foundation & AI Tooling',
            phaseNameVi: 'Giai đoạn 1: Nền tảng & Tích hợp Công cụ AI thế hệ mới',
            title: 'Master Generative Creative Toolchain',
            titleVi: 'Làm chủ Bộ công cụ Sáng tạo AI (Midjourney v6, ComfyUI, Adobe Firefly)',
            estimatedHours: 35,
            weeksDuration: 4,
            skillsCovered: ['Prompt Engineering for Visual Arts', 'Image-to-Image & Inpainting', 'Consistent Character & Brand Styling'],
            freeResources: [
              {
                name: 'OpenArt AI Prompt Book & ComfyUI Academy',
                provider: 'OpenArt (Free Guide)',
                url: 'https://openart.ai/promptbook',
                type: 'doc'
              },
              {
                name: 'Adobe Firefly Professional Workflow Series',
                provider: 'Adobe Creative Cloud YouTube',
                url: 'https://www.youtube.com/adobecreativecloud',
                type: 'video'
              }
            ],
            checkpointQuiz: {
              question: 'Để duy trì tính nhất quán về nhân vật và màu sắc thương hiệu khi sinh ảnh bằng AI, phương pháp nào mang lại độ kiểm soát chính xác nhất?',
              questionEn: 'To keep character and brand-color consistency when generating AI images, which method gives the most precise control?',
              options: [
                'Chỉ viết prompt dài hơn với nhiều tính từ',
                'Sử dụng ControlNet (OpenPose/Canny) kết hợp Seed và IP-Adapter',
                'Bấm nút Reroll liên tục cho đến khi ưng ý',
                'Chỉ sử dụng ảnh có sẵn trên mạng'
              ],
              optionsEn: [
                'Just write longer prompts with more adjectives',
                'Use ControlNet (OpenPose/Canny) combined with Seed and IP-Adapter',
                'Keep clicking Reroll until you are satisfied',
                'Only use images found online'
              ],
              correctIndex: 1,
              explanation: 'ControlNet cùng IP-Adapter cho phép cố định cấu trúc xương cơ thể, đường nét và phong cách màu sắc, tạo ra sự nhất quán cấp độ thương hiệu thương mại.',
              explanationEn: 'ControlNet with IP-Adapter locks body structure, line art, and color style, achieving commercial brand-level consistency.'
            }
          },
          {
            id: 'thao-m2',
            milestoneNumber: 2,
            phaseName: 'Core Product & UI/UX',
            phaseNameVi: 'Giai đoạn 2: Kỹ năng Cốt lõi & Thiết kế Trải nghiệm Sản phẩm',
            title: 'Figma Mastery & Design Systems with AI Plugins',
            titleVi: 'Làm chủ Figma & Xây dựng Design System quy chuẩn với AI Plugins',
            estimatedHours: 45,
            weeksDuration: 5,
            skillsCovered: ['Figma Auto Layout & Variables', 'Design Tokens & Atomic Design', 'Wireframing with AI (Relume, Galileo)'],
            freeResources: [
              {
                name: 'Figma 101 Official Certification Track',
                provider: 'Figma Community (Free)',
                url: 'https://help.figma.com/hc/en-us/categories/360002051613',
                type: 'doc'
              },
              {
                name: 'Google UX Design Professional Certificate Notes',
                provider: 'Coursera / Google (Audit Free)',
                url: 'https://grow.google/certificates/ux-design/',
                type: 'course'
              }
            ],
            checkpointQuiz: {
              question: 'Trong quy trình thiết kế Design System trên Figma, "Variables" và "Design Tokens" giúp giải quyết bài toán nào?',
              questionEn: 'In a Figma Design System workflow, which problem do "Variables" and "Design Tokens" solve?',
              options: [
                'Giúp vẽ icon vector nhanh hơn',
                'Quản trị nhất quán màu sắc, khoảng cách (spacing), dark mode trên toàn hệ sinh thái sản phẩm và đồng bộ với code',
                'Tự động viết code backend cho ứng dụng',
                'Nén dung lượng file thiết kế xuất ra'
              ],
              optionsEn: [
                'Drawing vector icons faster',
                'Managing consistent colors, spacing, and dark mode across the product ecosystem while syncing with code',
                'Auto-writing backend code for the application',
                'Compressing exported design file sizes'
              ],
              correctIndex: 1,
              explanation: 'Variables & Tokens tạo ra nguồn chân lý duy nhất (Single Source of Truth) giữa Design và Engineering, giảm 70% lỗi giao diện.',
              explanationEn: 'Variables & Tokens create a single source of truth between Design and Engineering, cutting UI defects by 70%.'
            }
          },
          {
            id: 'thao-m3',
            milestoneNumber: 3,
            phaseName: 'Portfolio & Validation',
            phaseNameVi: 'Giai đoạn 3: Xây dựng Portfolio & Đánh giá Năng lực',
            title: 'Ship 2 Commercial-Grade AI Case Studies',
            titleVi: 'Hoàn thiện 2 Case Study Thương mại Thực chiến (Agency & Product)',
            estimatedHours: 40,
            weeksDuration: 4,
            skillsCovered: ['Case Study Storytelling', 'Before/After Efficiency Metrics', 'Interactive Figma Prototype'],
            freeResources: [
              {
                name: 'Cofolios - Tech Company Design Intern & Junior Portfolios',
                provider: 'Cofolios (Curated Free)',
                url: 'https://cofolios.com',
                type: 'repo'
              }
            ],
            checkpointQuiz: {
              question: 'Yếu tố quan trọng nhất giúp một portfolio thiết kế có ứng dụng AI gây ấn tượng với nhà tuyển dụng cao cấp là gì?',
              questionEn: 'What matters most for an AI-powered design portfolio to impress senior hiring managers?',
              options: [
                'Số lượng ảnh đẹp tạo bằng Midjourney càng nhiều càng tốt',
                'Minh chứng rõ ràng về tư duy giải quyết vấn đề kinh doanh, số liệu tăng tốc quy trình và tính độc bản thương hiệu',
                'Giấu việc mình dùng AI để giả vờ vẽ tay',
                'Chỉ ghi tên các phần mềm đã dùng'
              ],
              optionsEn: [
                'As many beautiful Midjourney images as possible',
                'Clear evidence of business problem-solving, workflow speed metrics, and original brand thinking',
                'Hiding your AI use to pretend it is hand-drawn',
                'Only listing the software you used'
              ],
              correctIndex: 1,
              explanation: 'Nhà tuyển dụng tìm kiếm người có tư duy kinh doanh và khả năng dẫn dắt công cụ, chứ không phải người bấm nút ngẫu nhiên.',
              explanationEn: 'Hiring managers look for business thinking and the ability to direct tools, not random button pressing.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'persona-kiet-qa',
    name: 'Nguyễn Tuấn Kiệt',
    nameVi: 'Nguyễn Tuấn Kiệt (Đà Nẵng)',
    currentRole: 'Manual QA Tester (3 năm kinh nghiệm)',
    avatarSeed: 'Kiet',
    summaryQuote: 'Dự án outsource của công ty em bắt đầu giảm một nửa số lượng Manual Tester vì khách hàng yêu cầu viết kịch bản Playwright và tích hợp AI test tự động.',
    intakeProfile: {
      fullName: 'Nguyễn Tuấn Kiệt',
      currentRole: 'Manual Software QA',
      experienceYears: 3.0,
      education: 'Cử nhân Công nghệ Thông tin (Đại học Bách Khoa Đà Nẵng)',
      location: 'Đà Nẵng',
      interests: ['Software Testing', 'Automation', 'AI Model Evaluation', 'Cybersecurity', 'Python'],
      personalityTraits: ['Logic', 'Cẩn trọng', 'Thích tìm lỗi & tối ưu', 'Kiên nhẫn'],
      needsPriorities: {
        salary: 4,
        stability: 5,
        meaning: 3,
        remoteFlexibility: 5,
        workLifeBalance: 4
      },
      strengths: ['Tư duy tìm edge-case sâu', 'Hiểu quy trình phần mềm (Agile/Scrum)', 'Giao tiếp tốt với Developers', 'Viết tài liệu lỗi rõ ràng'],
      weaknesses: ['Chưa tự tin viết code automation từ đầu', 'Chưa có kinh nghiệm benchmark LLM', 'Ngại phỏng vấn tiếng Anh kỹ thuật'],
      constraints: {
        budgetVND: 3000000,
        hoursPerWeekAvailable: 15,
        preferredLocation: 'Đà Nẵng / Remote toàn cầu',
        riskTolerance: 'moderate'
      },
      values: ['Độ tin cậy công việc cao', 'Cơ hội làm việc remote cho công ty quốc tế', 'Môi trường kỹ thuật chuẩn mực'],
      workStyle: 'Làm việc theo mục tiêu (Sprint-based), thích quy trình rõ ràng và tự động hóa',
      forecastMode: 'realistic'
    },
    suggestions: [
      {
        id: 'sug-kiet-1',
        roleTitle: 'Automation QA & LLM Evaluation Engineer',
        roleTitleVi: 'Kỹ sư Đảm bảo Chất lượng Tự động hóa & Đánh giá Mô hình AI (AI/LLM Eval)',
        aiResilienceScore: 91,
        matchScore: 95,
        reasoning: 'Chuyển hóa trực giác bắt lỗi sâu sắc và hiểu biết về vòng đời phần mềm thành kỹ năng tự động hóa kiểm thử với Playwright/Python và đánh giá an toàn mô hình AI (Ragas, DeepEval).',
        reasoningEn: 'Transform your sharp defect-catching intuition and SDLC understanding into test automation skills with Playwright/Python and AI model safety evaluation (Ragas, DeepEval).',
        whyItFitsYou: 'Nhu cầu kiểm thử an toàn, chống ảo giác (hallucination) và bảo mật cho các ứng dụng tích hợp GenAI tại các công ty Outsource/Product ở Đà Nẵng và Remote đang tăng nhanh.',
        whyItFitsYouEn: 'Demand for safety testing, anti-hallucination, and security review of GenAI-integrated applications at outsourcing/product companies in Da Nang and remote roles is growing rapidly.',
        transferableSkillsMatch: ['Tư duy Boundary & Edge cases', 'Quy trình Bug Tracking & JIRA', 'Hiểu biết API REST/JSON', 'Kỹ năng giao tiếp kỹ thuật'],
        transferableSkillsMatchEn: ['Boundary & edge-case thinking', 'Bug tracking & JIRA workflows', 'REST/JSON API understanding', 'Technical communication skills'],
        skillsGap: ['Playwright / Cypress với TypeScript/Python', 'Khung đánh giá LLM (Ragas, TruLens, DeepEval)', 'Tích hợp CI/CD GitHub Actions cho Test Automation'],
        skillsGapEn: ['Playwright / Cypress with TypeScript/Python', 'LLM evaluation frameworks (Ragas, TruLens, DeepEval)', 'CI/CD integration with GitHub Actions for test automation'],
        averageSalaryRangeVND: '25,000,000 - 52,000,000 VND / tháng (hoặc 1,200$ - 2,500$ Remote)',
        evidenceCitations: [
          {
            paperTitle: 'Báo cáo Thị trường Tuyển dụng 2024 - 2025 (TopCV)',
            source: 'TopCV Việt Nam',
            year: 2024,
            url: 'https://insights.topcv.vn/recruitment-report-2024-2025',
            quoteOrDataPoint: 'Báo cáo thường niên lần thứ 5 của TopCV, phân tích gần 300.000 tin đăng tuyển dụng, ghi nhận tác động của AI và chuyển đổi số lên kỹ năng các ngành nghề tại Việt Nam.'
          },
          {
            paperTitle: 'The Future of Jobs Report 2023',
            source: 'World Economic Forum (WEF)',
            year: 2023,
            url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/',
            quoteOrDataPoint: 'AI and Machine Learning Specialists rank #1 among fastest-growing roles (~40% demand growth by 2027); 44% of workers\u2019 skills will be disrupted over 2023-2027.'
          }
        ],
        resilienceDetail: VIETNAM_OCCUPATIONS_DATABASE['manual-qa-tester'],
        trajectories: [
          {
            pathId: 'stay_augment',
            pathTitle: 'Stay & Master Playwright + AI Code Assist',
            pathTitleVi: 'Nâng cấp lên Senior Automation QA với Playwright & Copilot',
            feasibilityScore: 92,
            estimatedTimelineMonths: 3.5,
            shortDescription: 'Học viết kịch bản kiểm thử E2E bằng Playwright kết hợp Gemini Code Assist để tự động hóa 80% regression testing trong dự án hiện tại.',
            shortDescriptionEn: 'Learn to write E2E test scripts with Playwright combined with Gemini Code Assist to automate 80% of regression testing in your current project.',
            targetRoles: ['Automation Test Engineer', 'QA Lead', 'SDET Junior'],
            skillsToAcquire: ['Playwright / TypeScript', 'API Testing (Postman + Newman)', 'CI/CD Test Runner'],
            transferableSkills: ['Test plan design, Edge-case analysis, Bug reporting'],
            riskLevel: 'low',
            fiveYearSalaryProjection: [15, 24, 34, 44, 52],
            rationale: 'Thời gian chuyển đổi nhanh nhất, được công ty hiện tại ủng hộ và có thể áp dụng ngay vào dự án thực tế.',
            rationaleEn: 'Fastest transition time, backed by your current company, and immediately applicable to real projects.',
            actionStepNow: 'Viết bộ test tự động Playwright đầu tiên cho chức năng đăng nhập và thanh toán trên trang mẫu.',
            actionStepNowEn: 'Write your first Playwright automation suite for login and checkout features on a sample site.'
          },
          {
            pathId: 'pivot_adjacent',
            pathTitle: 'Pivot to LLM Evaluation & AI Safety Engineer',
            pathTitleVi: 'Chuyển sang Kỹ sư Đánh giá & An toàn Mô hình AI (LLM Evaluation Specialist)',
            feasibilityScore: 82,
            estimatedTimelineMonths: 5,
            shortDescription: 'Trở thành chuyên gia đánh giá độ chính xác của RAG, đo lường hallucination, kiểm thử tấn công prompt injection và tối ưu hóa benchmark cho doanh nghiệp.',
            shortDescriptionEn: 'Become an expert in evaluating RAG accuracy, measuring hallucination, testing prompt-injection attacks, and tuning enterprise benchmarks.',
            targetRoles: ['LLM Evaluation Engineer', 'AI Safety QA', 'AI Product QA Lead'],
            skillsToAcquire: ['Ragas / DeepEval framework', 'Prompt Injection Red-teaming', 'Python for Evaluation Pipelines'],
            transferableSkills: ['Adversarial testing mindset, Systematic metric tracking'],
            riskLevel: 'moderate',
            fiveYearSalaryProjection: [15, 28, 42, 58, 75],
            rationale: 'Thị trường toàn cầu cực kỳ thiếu hụt kỹ sư đánh giá AI chất lượng cao, tiềm năng làm việc remote với mức lương USD.',
            rationaleEn: 'The global market has an acute shortage of high-quality AI evaluation engineers, with remote USD-salary potential.',
            actionStepNow: 'Chạy thử thư viện Ragas để đo lường độ Faithful và Answer Relevance trên một tập dữ liệu Q&A tiếng Việt.',
            actionStepNowEn: 'Run the Ragas library to measure Faithfulness and Answer Relevance on a Vietnamese Q&A dataset.'
          },
          {
            pathId: 'full_switch',
            pathTitle: 'Full Switch to DevOps & MLOps Infrastructure',
            pathTitleVi: 'Chuyển hẳn sang Kỹ sư Vận hành Hạ tầng AI/DevOps (MLOps Engineer)',
            feasibilityScore: 60,
            estimatedTimelineMonths: 10,
            shortDescription: 'Học quản trị Docker, Kubernetes, CI/CD pipelines và triển khai mô hình AI trên đám mây (GCP Cloud Run, Vertex AI).',
            shortDescriptionEn: 'Learn Docker, Kubernetes, CI/CD pipelines, and deploying AI models on the cloud (GCP Cloud Run, Vertex AI).',
            targetRoles: ['DevOps Engineer', 'MLOps Engineer', 'Cloud Infrastructure QA'],
            skillsToAcquire: ['Docker & Kubernetes', 'GCP / Cloud Run / Terraform', 'Model Monitoring & Observability'],
            transferableSkills: ['Hệ thống, Tư duy quy trình, Kỷ luật kỹ thuật'],
            riskLevel: 'high',
            fiveYearSalaryProjection: [15, 22, 38, 55, 78],
            rationale: 'Mức thu nhập trần rất cao nhưng cần đầu tư thời gian học hạ tầng mạng và hệ điều hành sâu.',
            rationaleEn: 'Very high income ceiling, but it requires deep investment in networking infrastructure and OS fundamentals.',
            actionStepNow: 'Tạo tài khoản Google Cloud và deploy ứng dụng container đầu tiên lên Cloud Run.',
            actionStepNowEn: 'Create a Google Cloud account and deploy your first containerized app to Cloud Run.'
          }
        ],
        roadmap: [
          {
            id: 'kiet-m1',
            milestoneNumber: 1,
            phaseName: 'Foundation Automation',
            phaseNameVi: 'Giai đoạn 1: Nền tảng Tự động hóa với Playwright & TypeScript',
            title: 'Modern E2E Test Automation Pipeline',
            titleVi: 'Xây dựng Luồng Kiểm thử Tự động E2E với Playwright & TypeScript',
            estimatedHours: 40,
            weeksDuration: 4,
            skillsCovered: ['Playwright Locators & Assertions', 'Page Object Model (POM)', 'API & Network Mocking'],
            freeResources: [
              {
                name: 'Playwright Official Documentation & Quickstart',
                provider: 'Microsoft Playwright (Free)',
                url: 'https://playwright.dev/docs/intro',
                type: 'doc'
              },
              {
                name: 'TypeScript for Testers Masterclass',
                provider: 'freeCodeCamp (Free YouTube)',
                url: 'https://www.freecodecamp.org',
                type: 'video'
              }
            ],
            checkpointQuiz: {
              question: 'Tại sao Page Object Model (POM) được coi là chuẩn thiết kế hàng đầu trong Test Automation?',
              questionEn: 'Why is the Page Object Model (POM) considered the leading design pattern in test automation?',
              options: [
                'Vì nó giúp test chạy nhanh hơn gấp 10 lần',
                'Vì nó tách biệt cấu trúc trang (UI locators) khỏi logic kịch bản test, giúp bảo trì dễ dàng khi giao diện thay đổi',
                'Vì nó không cần viết code',
                'Vì nó chỉ dùng được cho một trang duy nhất'
              ],
              optionsEn: [
                'Because it makes tests run 10 times faster',
                'Because it separates page structure (UI locators) from test scenario logic, making maintenance easy when the UI changes',
                'Because it requires no code',
                'Because it only works for a single page'
              ],
              correctIndex: 1,
              explanation: 'POM giúp tái sử dụng mã nguồn và khi UI thay đổi, bạn chỉ cần sửa locator ở 1 file duy nhất thay vì hàng trăm file test.',
              explanationEn: 'POM enables code reuse; when the UI changes, you fix locators in one file instead of hundreds of test files.'
            }
          },
          {
            id: 'kiet-m2',
            milestoneNumber: 2,
            phaseName: 'AI Model Testing',
            phaseNameVi: 'Giai đoạn 2: Kỹ thuật Đánh giá Mô hình AI & RAG Benchmarking',
            title: 'LLM Evaluation & Ragas/DeepEval Mastery',
            titleVi: 'Làm chủ Khung Đánh giá AI & Đo lường RAG (Faithfulness & Hallucination)',
            estimatedHours: 45,
            weeksDuration: 5,
            skillsCovered: ['RAG Triad (Context Precision, Recall, Faithfulness)', 'Red-Teaming & Prompt Injection Testing', 'Automated CI/CD Quality Gates for AI'],
            freeResources: [
              {
                name: 'Ragas: Evaluation Framework for LLM & RAG',
                provider: 'Exploding Gradients (Open Source Docs)',
                url: 'https://docs.ragas.io',
                type: 'doc'
              },
              {
                name: 'DeepEval: The Open-Source LLM Evaluation Framework',
                provider: 'Confident AI (Free Docs & Tutorials)',
                url: 'https://docs.confident-ai.com',
                type: 'doc'
              }
            ],
            checkpointQuiz: {
              question: 'Chỉ số "Faithfulness" trong đánh giá hệ thống RAG (Retrieval-Augmented Generation) đo lường điều gì?',
              questionEn: 'What does the "Faithfulness" metric measure when evaluating a RAG (Retrieval-Augmented Generation) system?',
              options: [
                'Tốc độ phản hồi của API',
                'Mức độ câu trả lời của AI dựa hoàn toàn vào tài liệu tham khảo được cung cấp (không tự bịa ra thông tin)',
                'Độ dài của câu trả lời',
                'Số lượng từ ngữ học thuật sử dụng'
              ],
              optionsEn: [
                'API response speed',
                'How fully the AI answer is grounded in the provided reference documents (without fabricating information)',
                'The length of the answer',
                'The number of academic words used'
              ],
              correctIndex: 1,
              explanation: 'Faithfulness đo lường tỷ lệ các luận điểm trong câu trả lời có thể suy ra trực tiếp từ Context, là cốt lõi để chống ảo giác (Hallucination).',
              explanationEn: 'Faithfulness measures the share of claims in the answer directly inferable from the Context — the core defense against hallucination.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'persona-chi-business',
    name: 'Trần Mai Chi',
    nameVi: 'Trần Mai Chi (Hà Nội)',
    currentRole: 'Sinh viên mới tốt nghiệp Quản trị Kinh doanh / Marketing',
    avatarSeed: 'Chi',
    summaryQuote: 'Mới ra trường apply các vị trí Content Marketing và Data Entry đều nhận phản hồi tuyển dụng đóng lại do doanh nghiệp chuyển sang dùng AI tools.',
    intakeProfile: {
      fullName: 'Trần Mai Chi',
      currentRole: 'Fresh Business Graduate',
      experienceYears: 0.5,
      education: 'Cử nhân Quản trị Kinh doanh (Đại học Kinh tế Quốc dân - NEU)',
      location: 'Hà Nội',
      interests: ['Business Analytics', 'Digital Marketing', 'AI Workflow Automation', 'E-commerce', 'Project Management'],
      personalityTraits: ['Năng động', 'Thích học cái mới', 'Tư duy logic kinh doanh', 'Kỹ năng giao tiếp tốt'],
      needsPriorities: {
        salary: 4,
        stability: 4,
        meaning: 4,
        remoteFlexibility: 3,
        workLifeBalance: 3
      },
      strengths: ['Tư duy tổng quan về doanh nghiệp', 'Tiếng Anh IELTS 7.0', 'Thuyết trình mạch lạc', 'Khả năng tự học nhanh'],
      weaknesses: ['Thiếu kinh nghiệm thực chiến công nghệ sâu', 'Chưa có portfolio dự án cụ thể'],
      constraints: {
        budgetVND: 1500000,
        hoursPerWeekAvailable: 18,
        preferredLocation: 'Hà Nội / Hybrid',
        riskTolerance: 'high'
      },
      values: ['Cơ hội thăng tiến nhanh', 'Được làm việc trực tiếp với ban lãnh đạo', 'Tiếp cận công nghệ mới'],
      workStyle: 'Nhiệt huyết, thích giải quyết bài toán tăng trưởng và tối ưu vận hành',
      forecastMode: 'optimistic'
    },
    suggestions: [
      {
        id: 'sug-chi-1',
        roleTitle: 'AI Operations & Business Automation Specialist',
        roleTitleVi: 'Chuyên viên Vận hành AI & Tự động hóa Quy trình Doanh nghiệp (AI Ops Analyst)',
        aiResilienceScore: 89,
        matchScore: 94,
        reasoning: 'Kết hợp nền tảng tư duy kinh doanh và tiếng Anh xuất sắc để trở thành cầu nối số 1 giữa nhu cầu ban giám đốc và các công cụ AI (tự động hóa marketing, CRM, báo cáo tài chính).',
        reasoningEn: 'Combine your business thinking foundation and excellent English to become the bridge between executive needs and AI tools (marketing automation, CRM, financial reporting).',
        whyItFitsYou: 'Doanh nghiệp SME và tập đoàn tại Hà Nội đang khát các bạn trẻ hiểu ngôn ngữ kinh doanh nhưng biết dùng n8n, Make, Zapier và Gemini API để tối ưu chi phí vận hành 40%.',
        whyItFitsYouEn: 'SMEs and corporations in Hanoi are eager for young talent who speak the language of business and can use n8n, Make, Zapier, and the Gemini API to cut operating costs by 40%.',
        transferableSkillsMatch: ['Tư duy kinh doanh (Marketing/Finance)', 'Tiếng Anh làm việc quốc tế', 'Kỹ năng thuyết trình & Stakeholder alignment'],
        transferableSkillsMatchEn: ['Business thinking (Marketing/Finance)', 'International working English', 'Presentation & stakeholder alignment skills'],
        skillsGap: ['Xây dựng luồng tự động hóa No-code/Low-code (n8n, Make)', 'Phân tích dữ liệu với Python/SQL cơ bản', 'Prompt Engineering cho báo cáo kinh doanh'],
        skillsGapEn: ['Building No-code/Low-code automation flows (n8n, Make)', 'Data analysis with basic Python/SQL', 'Prompt Engineering for business reporting'],
        averageSalaryRangeVND: '16,000,000 - 32,000,000 VND / tháng cho Fresher/Junior AI Ops',
        evidenceCitations: [
          {
            paperTitle: 'Stanford HAI AI Index Report 2024',
            source: 'Stanford Institute for Human-Centered AI',
            year: 2024,
            url: 'https://aiindex.stanford.edu/report/',
            quoteOrDataPoint: 'AI use raises worker productivity and work quality (BCG/Harvard field study: 12.2% more tasks, 25.1% faster, 40% higher quality); AI skill demand keeps spreading across sectors.'
          },
          {
            paperTitle: 'The Future of Jobs Report 2023',
            source: 'World Economic Forum (WEF)',
            year: 2023,
            url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/',
            quoteOrDataPoint: 'Globally, 69 million jobs are expected to be created vs 83 million displaced by 2027 (net -14 million); Business Intelligence Analysts rank #3 among the fastest-growing roles.'
          }
        ],
        resilienceDetail: VIETNAM_OCCUPATIONS_DATABASE['business-analyst-data'],
        trajectories: [
          {
            pathId: 'stay_augment',
            pathTitle: 'Become AI Growth & Ops Analyst',
            pathTitleVi: 'Trở thành Chuyên viên Tăng trưởng & Vận hành AI (AI Ops Analyst)',
            feasibilityScore: 90,
            estimatedTimelineMonths: 3,
            shortDescription: 'Học kết hợp Make/n8n với Gemini API để xây dựng hệ thống tự động hóa marketing, chăm sóc khách hàng và tổng hợp báo cáo tuần.',
            shortDescriptionEn: 'Learn to combine Make/n8n with the Gemini API to build automated marketing, customer care, and weekly reporting systems.',
            targetRoles: ['AI Operations Analyst', 'Growth Ops Associate', 'Digital Transformation Executive'],
            skillsToAcquire: ['Make.com & n8n Workflows', 'Gemini & OpenAI API Integration', 'Google Sheets Advanced & Looker Studio'],
            transferableSkills: ['Business strategy, English communication, Presentation'],
            riskLevel: 'low',
            fiveYearSalaryProjection: [12, 20, 32, 45, 60],
            rationale: 'Tận dụng 100% bằng cử nhân kinh tế và tiếng Anh, không yêu cầu bằng CNTT chuyên sâu.',
            rationaleEn: 'Fully leverages your economics degree and English with no deep IT background required.',
            actionStepNow: 'Tạo tài khoản Make.com và tự động hóa luồng lấy tin tức thị trường gửi vào Google Sheets và Telegram.',
            actionStepNowEn: 'Create a Make.com account and automate a flow that fetches market news into Google Sheets and Telegram.'
          },
          {
            pathId: 'pivot_adjacent',
            pathTitle: 'Pivot to Product Management (AI Products)',
            pathTitleVi: 'Chuyển sang Quản lý Sản phẩm Công nghệ AI (Associate Product Manager - APM)',
            feasibilityScore: 75,
            estimatedTimelineMonths: 6,
            shortDescription: 'Định hướng trở thành APM chuyên trách các tính năng AI trong ứng dụng fintech, edtech hoặc e-commerce.',
            shortDescriptionEn: 'Target becoming an APM focused on AI features in fintech, edtech, or e-commerce applications.',
            targetRoles: ['Associate Product Manager', 'Product Analyst', 'Scrum Product Owner'],
            skillsToAcquire: ['Product Discovery & User Journey', 'PRD (Product Requirement Document) Writing', 'Tech Architecture Fundamentals'],
            transferableSkills: ['Market research, User empathy, Business case framing'],
            riskLevel: 'moderate',
            fiveYearSalaryProjection: [12, 24, 38, 55, 75],
            rationale: 'Con đường sự nghiệp quản lý cấp cao rất sáng giá với tiềm năng trở thành CPO / VP of Product.',
            rationaleEn: 'A promising senior management track with the potential to grow into CPO / VP of Product.',
            actionStepNow: 'Viết 1 bản PRD chi tiết đề xuất tính năng trợ lý AI cho ứng dụng mua sắm thương mại điện tử.',
            actionStepNowEn: 'Write a detailed PRD proposing an AI assistant feature for an e-commerce shopping app.'
          },
          {
            pathId: 'full_switch',
            pathTitle: 'Switch to Quantitative Business Intelligence',
            pathTitleVi: 'Chuyển hẳn sang Chuyên viên Trí tuệ Doanh nghiệp & Dữ liệu Lớn (BI Engineer)',
            feasibilityScore: 65,
            estimatedTimelineMonths: 8,
            shortDescription: 'Học sâu SQL, Python (Pandas/NumPy), Power BI và Data Warehouse để xử lý dữ liệu quy mô lớn.',
            shortDescriptionEn: 'Go deep on SQL, Python (Pandas/NumPy), Power BI, and Data Warehousing to process large-scale data.',
            targetRoles: ['BI Analyst', 'Data Analyst', 'Commercial Analytics Lead'],
            skillsToAcquire: ['SQL & Data Modeling', 'Python for Data Analysis', 'Power BI / Tableau DAX'],
            transferableSkills: ['Business logic, Statistical intuition'],
            riskLevel: 'moderate',
            fiveYearSalaryProjection: [12, 22, 35, 50, 70],
            rationale: 'Nền tảng kỹ thuật vững chắc giúp bạn không bao giờ lỗi thời trong mọi chu kỳ kinh tế.',
            rationaleEn: 'A solid technical foundation never goes out of style in any economic cycle.',
            actionStepNow: 'Hoàn thành khóa học SQL for Data Analytics miễn phí trên W3Schools và Kaggle.',
            actionStepNowEn: 'Complete the free SQL for Data Analytics courses on W3Schools and Kaggle.'
          }
        ],
        roadmap: [
          {
            id: 'chi-m1',
            milestoneNumber: 1,
            phaseName: 'No-Code AI Automation',
            phaseNameVi: 'Giai đoạn 1: Tự động hóa Không cần Code với n8n/Make & Gemini',
            title: 'Enterprise Workflow Automation with Gemini API',
            titleVi: 'Xây dựng Luồng Tự động hóa Doanh nghiệp với Make.com & Gemini API',
            estimatedHours: 35,
            weeksDuration: 4,
            skillsCovered: ['Make / n8n Webhooks & JSON', 'Gemini API Function Calling Basics', 'Automated Reporting to Google Sheets & Slack'],
            freeResources: [
              {
                name: 'Make.com Academy Foundation Level 1 & 2',
                provider: 'Make.com Official (Free Certification)',
                url: 'https://academy.make.com',
                type: 'course'
              },
              {
                name: 'Google AI Studio & Gemini API Quickstart Tutorial',
                provider: 'Google for Developers',
                url: 'https://ai.google.dev/gemini-api/docs/quickstart',
                type: 'doc'
              }
            ],
            checkpointQuiz: {
              question: 'Khi cần tự động trích xuất thông tin khách hàng từ email gửi vào bảng tính Google Sheets và gửi tóm tắt cho Sales qua Telegram, giải pháp tối ưu nhất là gì?',
              questionEn: 'To automatically extract customer information from emails into Google Sheets and send summaries to Sales via Telegram, what is the optimal solution?',
              options: [
                'Thuê 1 nhân viên ngồi trực 24/7 copy paste',
                'Sử dụng Webhook kích hoạt luồng Make.com/n8n gọi Gemini API trích xuất JSON rồi ghi trực tiếp vào Sheets và gửi bot Telegram',
                'Tắt tính năng nhận email',
                'In email ra giấy'
              ],
              optionsEn: [
                'Hire someone to copy-paste around the clock',
                'Use a webhook to trigger a Make.com/n8n flow that calls the Gemini API to extract JSON, then writes to Sheets and messages a Telegram bot',
                'Turn off incoming email',
                'Print the emails on paper'
              ],
              correctIndex: 1,
              explanation: 'Luồng tự động hóa kết hợp Gemini trích xuất cấu trúc dữ liệu JSON thực hiện trong < 2 giây với chi phí gần như 0 đồng.',
              explanationEn: 'An automation flow where Gemini extracts structured JSON runs in under 2 seconds at near-zero cost.'
            }
          }
        ]
      }
    ]
  }
];

export function getGoldenPersonaById(id: string): GoldenPersona | undefined {
  return GOLDEN_PROFILES.find(p => p.id === id);
}
