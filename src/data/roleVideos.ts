export interface RoleMediaVideo {
  id: string; // 11-character verified YouTube video ID
  titleVi: string;
  titleEn: string;
  sourceTag: string;
  channelName: string;
}

export const DEFAULT_MEDIA_VIDEOS: RoleMediaVideo[] = [
  {
    id: 'aKrhPf8qf-Y',
    titleVi: 'A.I đang tái cấu trúc thị trường lao động như thế nào?',
    titleEn: 'How is AI restructuring the labor market?',
    sourceTag: 'VTV24 Broadcast',
    channelName: 'VTV24'
  },
  {
    id: 'wmKMa_KavrY',
    titleVi: 'Giới trẻ đối mặt áp lực trên thị trường lao động',
    titleEn: 'Young workers facing pressure in the labor market',
    sourceTag: 'VTV24 Special Report',
    channelName: 'VTV24'
  }
];

interface RoleVideoCluster {
  keywords: string[];
  roleTitleVi: string;
  roleTitleEn: string;
  videos: RoleMediaVideo[];
}

export const ROLE_VIDEO_CLUSTERS: RoleVideoCluster[] = [
  // 1. Manual QC / QA / Software Testing / Kiểm thử phần mềm
  {
    keywords: ['qc', 'qa', 'test', 'tester', 'kiểm thử', 'manual test', 'quality control', 'quality assurance'],
    roleTitleVi: 'Kiểm thử phần mềm & Đảm bảo chất lượng (QC / QA Tester)',
    roleTitleEn: 'Manual QC & Software Testing (QA Engineer)',
    videos: [
      {
        id: 'xe3AvrYX1ss',
        titleVi: 'Liệu AI có thay thế kiểm thử viên (Manual QC / Tester) hay không?',
        titleEn: 'Will AI Replace Software Testers? The Real Shift in QA',
        sourceTag: 'Software Testing Hacks',
        channelName: 'Software Testing Hacks'
      },
      {
        id: 'dFHRDklaLFQ',
        titleVi: 'Tác động của Claude & AI Agents lên quy trình Kiểm thử phần mềm',
        titleEn: 'How Generative AI & Autonomous Agents are Reshaping Testing',
        sourceTag: 'Full Disclosure Tech',
        channelName: 'Full Disclosure'
      }
    ]
  },
  // 2. Kế toán / Kiểm toán / Thuế / Tài chính (Accountant / Auditor)
  {
    keywords: ['kế toán', 'ke toan', 'accountant', 'accounting', 'kiểm toán', 'thuế', 'tax', 'bookkeeper', 'sổ sách'],
    roleTitleVi: 'Kế toán & Kiểm toán (Accountant & Auditor)',
    roleTitleEn: 'Accounting & Auditing (Accountant / Auditor)',
    videos: [
      {
        id: 'K3Ga8p2aH2Y',
        titleVi: 'Liệu AI có thay thế Kế toán viên vào năm 2030?',
        titleEn: 'Will AI Replace Accountants by 2030? Debunking the Myths',
        sourceTag: 'CMA Coach Academy',
        channelName: 'CMA Coach'
      },
      {
        id: 'p3wD6XGBk1c',
        titleVi: 'Vì sao AI không thể thay thế Kế toán viên chiến lược?',
        titleEn: "AI Won't Replace Accountants & Bookkeepers: Here's Why",
        sourceTag: 'ICA Consulting Expert View',
        channelName: 'ICA Consulting'
      }
    ]
  },
  // 3. Thiết kế đồ họa / UI/UX / Đồ họa (Graphic Designer / Creative)
  {
    keywords: ['thiết kế', 'thiet ke', 'designer', 'graphic', 'đồ họa', 'ui', 'ux', 'photoshop', 'illustrator', 'visual art'],
    roleTitleVi: 'Thiết kế đồ họa & Nghệ thuật số (Graphic Designer & UI/UX)',
    roleTitleEn: 'Graphic Design & Creative Arts (UI/UX Designer)',
    videos: [
      {
        id: 'Uiea_Ub5Bgk',
        titleVi: 'Nhà thiết kế đối đầu Trí tuệ Nhân tạo: Thách thức và cơ hội',
        titleEn: 'Designers VS AI: The Future of Creative Visual Work',
        sourceTag: 'The Futur',
        channelName: 'The Futur'
      },
      {
        id: 'oSXC58n04xU',
        titleVi: 'AI có thay thế việc làm ngành Thiết kế Đồ họa không?',
        titleEn: 'Will AI Replace Your Job? - Graphic Design Industry Outlook',
        sourceTag: 'Austin Marchese Insights',
        channelName: 'Austin Marchese'
      }
    ]
  },
  // 4. Content Writer / Copywriter / Sáng tạo nội dung / Marketing
  {
    keywords: ['content', 'copywriter', 'viết', 'viet bai', 'biên tập', 'editor', 'báo chí', 'seo', 'marketing'],
    roleTitleVi: 'Sáng tạo nội dung & Copywriting (Content Writer)',
    roleTitleEn: 'Content Writing & Copywriting (Content Strategist)',
    videos: [
      {
        id: 'ynCT4rmE0DE',
        titleVi: 'Liệu AI có thay thế người viết Content / Copywriter trong năm 2026?',
        titleEn: 'Will AI Replace Copywriters In 2026? Industry Perspectives',
        sourceTag: 'Matthew Volkwyn Media',
        channelName: 'Matthew Volkwyn'
      },
      {
        id: 'ula3kl357Vg',
        titleVi: 'Tương lai của người viết trước làn sóng GenAI',
        titleEn: 'Will AI Replace Copywriters? Insider Interview with AI Specialists',
        sourceTag: 'Alex Cattoni Marketing',
        channelName: 'Alex Cattoni'
      }
    ]
  },
  // 5. Software Engineer / Lập trình viên / Developer / IT
  {
    keywords: ['developer', 'lập trình', 'lap trinh', 'coder', 'software engineer', 'it', 'cntt', 'frontend', 'backend', 'fullstack'],
    roleTitleVi: 'Kỹ sư Phần mềm & Lập trình viên (Software Engineer)',
    roleTitleEn: 'Software Engineering & Programming (Software Developer)',
    videos: [
      {
        id: 'WIhvfnjIxMc',
        titleVi: 'Tác động thực tế toàn diện của AI lên ngành Lập trình Phần mềm',
        titleEn: 'The TRUE Impact of AI on Software Engineering (In-Depth Analysis)',
        sourceTag: 'Sajjaad Khader Tech',
        channelName: 'Sajjaad Khader'
      },
      {
        id: 'LV-Uu7GvpUo',
        titleVi: 'Liệu AI có thay thế Kỹ sư Phần mềm trong tương lai?',
        titleEn: 'Will AI Replace Software Engineers? The Future Awaits',
        sourceTag: 'Drive White Coding Insights',
        channelName: 'Drive White'
      }
    ]
  },
  // 6. Data Analyst / Phân tích dữ liệu / BI
  {
    keywords: ['data', 'dữ liệu', 'du lieu', 'analyst', 'analytics', 'bi', 'powerbi', 'sql'],
    roleTitleVi: 'Phân tích dữ liệu & BI (Data Analyst)',
    roleTitleEn: 'Data Analytics & Business Intelligence (Data Analyst)',
    videos: [
      {
        id: 'YIA3soZv-NY',
        titleVi: 'Liệu AI có thay thế chuyên viên Phân tích Dữ liệu trong 10 năm tới?',
        titleEn: 'Will AI Replace Data Analysts in the Next 10 Years?',
        sourceTag: 'Matt Mike Analytics',
        channelName: 'Matt Mike'
      },
      {
        id: 'yKDH4Qk6gwU',
        titleVi: 'AI và nghề phân tích dữ liệu: Những gì bạn cần trang bị năm 2026',
        titleEn: 'Will AI Replace Data Analysts? What You MUST Learn in 2026',
        sourceTag: 'Data with Decision',
        channelName: 'Data with Decision'
      }
    ]
  },
  // 7. CSKH / Customer Support / Telesales / Chăm sóc khách hàng
  {
    keywords: ['cskh', 'customer', 'chăm sóc', 'cham soc', 'support', 'telesales', 'call center', 'tổng đài', 'bpo'],
    roleTitleVi: 'Chăm sóc khách hàng & Dịch vụ Tổng đài (Customer Support)',
    roleTitleEn: 'Customer Support & Contact Center (Customer Care Specialist)',
    videos: [
      {
        id: 'I_52xW70aHE',
        titleVi: 'Liệu AI có thay thế tổng đài viên? Tương lai ngành BPO & CSKH',
        titleEn: 'Will AI Replace Call Center Agents? The Future of BPO & Customer Service',
        sourceTag: 'Codes & Fables Tech',
        channelName: 'Codes & Fables'
      },
      {
        id: 'hzgZCWOBnz0',
        titleVi: 'AI Voice Agents đang chuyển đổi dịch vụ khách hàng như thế nào?',
        titleEn: "AI Voice Agents Are Replacing Customer Service Jobs — The Data Behind It",
        sourceTag: 'Krybe Industry Report',
        channelName: 'Krybe'
      }
    ]
  },
  // 8. Tuyển dụng / Nhân sự / HR (Human Resources)
  {
    keywords: ['hr', 'nhân sự', 'nhan su', 'tuyển dụng', 'tuyen dung', 'recruiter', 'headhunter'],
    roleTitleVi: 'Quản trị Nhân sự & Tuyển dụng (HR & Talent Acquisition)',
    roleTitleEn: 'Human Resources & Talent Acquisition (HR Specialist)',
    videos: [
      {
        id: '3LTE__yDbP8',
        titleVi: 'Liệu AI có thay thế chuyên viên tuyển dụng nhân sự (Recruiter)?',
        titleEn: 'Will AI Replace Recruiters? The Honest Answer',
        sourceTag: 'Optimum Consulting Global',
        channelName: 'Optimum Consulting'
      },
      {
        id: 'DzRQyDtvRMU',
        titleVi: 'AI không thay thế nhà tuyển dụng, nhưng sẽ thay đổi căn bản công việc',
        titleEn: 'AI Won’t Replace Recruiters — But It WILL Change the Job',
        sourceTag: 'The Elite Recruiter Podcast',
        channelName: 'The Elite Recruiter'
      }
    ]
  },
  // 9. Giáo viên / Giảng viên / Đào tạo (Teacher / Educator)
  {
    keywords: ['giáo viên', 'giao vien', 'teacher', 'giảng viên', 'giang vien', 'educator', 'dạy học', 'đào tạo'],
    roleTitleVi: 'Giáo dục & Giảng dạy (Teacher / Educator)',
    roleTitleEn: 'Education & Teaching (Educator / Instructor)',
    videos: [
      {
        id: 'xHr18GEJqck',
        titleVi: 'Vì sao AI không bao giờ thay thế được một người thầy thực thụ?',
        titleEn: 'Why AI Will Never Replace a Great Teacher (Matt Wu | TED)',
        sourceTag: 'TED Talks',
        channelName: 'TED'
      },
      {
        id: 'vB-D_620ZnU',
        titleVi: 'Trí tuệ Nhân tạo có thể thay thế giáo viên hay không?',
        titleEn: 'Can AI Replace Teachers? Technology in Education',
        sourceTag: 'Bloomberg Television',
        channelName: 'Bloomberg Technology'
      }
    ]
  },
  // 10. Công nhân may / Sản xuất / Lao động nhà máy (Manufacturing & Factory Worker)
  {
    keywords: ['công nhân', 'cong nhan', 'may mặc', 'may mac', 'garment', 'sản xuất', 'san xuat', 'nhà máy', 'factory'],
    roleTitleVi: 'Công nhân Sản xuất & Lao động Công nghiệp (Manufacturing Worker)',
    roleTitleEn: 'Manufacturing & Industrial Workforce (Factory Worker)',
    videos: [
      {
        id: 'FjbdG4BvNdE',
        titleVi: 'Tự động hóa và Robot trong ngành Sản xuất: Tác động đến lao động',
        titleEn: 'Automation & Robotics in Manufacturing: Global Workforce Realities',
        sourceTag: 'Industrial Insights',
        channelName: 'Kanał KMH'
      },
      {
        id: 'aKrhPf8qf-Y',
        titleVi: 'A.I đang tái cấu trúc thị trường lao động như thế nào?',
        titleEn: 'How is AI restructuring the labor market?',
        sourceTag: 'VTV24 Broadcast',
        channelName: 'VTV24'
      }
    ]
  }
];

export function getVideosForRole(role?: string): {
  isCustomRole: boolean;
  targetRoleVi: string;
  targetRoleEn: string;
  videos: RoleMediaVideo[];
} {
  if (!role || !role.trim()) {
    return {
      isCustomRole: false,
      targetRoleVi: 'Tổng thể Thị trường Lao động',
      targetRoleEn: 'Overall Labor Market',
      videos: DEFAULT_MEDIA_VIDEOS
    };
  }

  const normalized = role.toLowerCase().trim();

  // Find exact or substring match in keyword list
  for (const cluster of ROLE_VIDEO_CLUSTERS) {
    if (cluster.keywords.some(kw => normalized.includes(kw))) {
      return {
        isCustomRole: true,
        targetRoleVi: cluster.roleTitleVi,
        targetRoleEn: cluster.roleTitleEn,
        videos: cluster.videos
      };
    }
  }

  // If no exact cluster match, return high-relevance default videos with the user's role title
  return {
    isCustomRole: true,
    targetRoleVi: role,
    targetRoleEn: role,
    videos: DEFAULT_MEDIA_VIDEOS
  };
}
