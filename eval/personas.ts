import type { UserIntakeProfile } from '../src/types';
import { GOLDEN_PROFILES } from '../src/data/goldenProfiles';

export type PersonaSegment = 'knowledge_worker' | 'wage_worker' | 'rural_agricultural' | 'student' | 'craft_trade';

export interface EvalPersona {
  id: string;
  label: string;
  intake: UserIntakeProfile;
  challenging?: boolean;
  segment: PersonaSegment;
}

const p = (
  id: string,
  label: string,
  intake: UserIntakeProfile,
  segment: PersonaSegment,
  challenging = false
): EvalPersona => ({ id, label, intake, segment, challenging });

// Golden demo personas are office/professional roles; tag by role text.
function goldenSegment(currentRole: string): PersonaSegment {
  return 'knowledge_worker';
}

export const EVAL_PERSONAS: EvalPersona[] = [
  // 3 golden personas reused from the platform's demo set
  ...GOLDEN_PROFILES.map((g, i) =>
    p(`persona-golden-${i + 1}`, g.name, g.intakeProfile, goldenSegment(g.currentRole))
  ),

  // 9 synthetic personas covering diverse Vietnamese worker situations
  p('persona-accountant', 'Minh Anh - Accountant', {
    currentRole: 'Kế toán tổng hợp',
    experienceYears: 6,
    education: 'Cử nhân Kế toán (ĐH Kinh tế Quốc dân)',
    location: 'Hà Nội',
    currentSkills: ['Excel nâng cao', 'Phần mềm MISA', 'Thủ thuật thuế', 'Kiểm soát chứng từ'],
    strengths: ['Cẩn thận, chi tiết', 'Nắm vững quy trình kế toán', 'Tư duy tuân thủ quy định'],
    weaknesses: ['Chưa biết dùng công cụ phân tích dữ liệu', 'Kỹ năng trình bày số liệu còn yếu'],
    interests: ['Phân tích tài chính', 'Công nghệ số'],
    forecastMode: 'realistic',
    constraints: { budgetVND: 4000000, hoursPerWeekAvailable: 10, riskTolerance: 'low' }
  }, 'knowledge_worker'),
  p('persona-garment', 'Thùy Dung - Garment Worker', {
    currentRole: 'Công nhân may công nghiệp',
    experienceYears: 8,
    education: 'Trung học phổ thông',
    location: 'Bình Dương',
    currentSkills: ['Vận hành máy may công nghiệp', 'Đọc bản vẽ kỹ thuật', 'Kiểm tra chất lượng sản phẩm'],
    strengths: ['Khéo tay', 'Chịu được áp lực đơn hàng', 'Làm việc nhóm theo chuyền'],
    weaknesses: ['Ít tiếp xúc máy tính', 'Tiếng Anh hạn chế'],
    interests: ['Kinh doanh nhỏ', 'Nghề thủ công'],
    forecastMode: 'conservative',
    constraints: { budgetVND: 2000000, hoursPerWeekAvailable: 6, riskTolerance: 'low' }
  }, 'wage_worker'),
  p('persona-teacher', 'Thu Hà - High School Teacher', {
    currentRole: 'Giáo viên Ngữ văn cấp 3',
    experienceYears: 12,
    education: 'Thạc sĩ Sư phạm Ngữ văn',
    location: 'Đà Nẵng',
    currentSkills: ['Thiết kế bài giảng', 'Quản lý lớp học', 'Đánh giá học sinh', 'Truyền cảm hứng'],
    strengths: ['Giao tiếp xuất sắc', 'Tư duy phản biện', 'Kiến thức nhân văn sâu'],
    weaknesses: ['Chưa ứng dụng AI vào giảng dạy', 'Kỹ năng số cơ bản'],
    interests: ['Giáo dục công nghệ', 'Viết nội dung', 'Tâm lý học'],
    forecastMode: 'realistic',
    constraints: { budgetVND: 3000000, hoursPerWeekAvailable: 8, riskTolerance: 'moderate' }
  }, 'knowledge_worker'),
  p('persona-juniordev', 'Quang Huy - Junior Developer', {
    currentRole: 'Lập trình viên Front-end (junior)',
    experienceYears: 1.5,
    education: 'Cử nhân CNTT (ĐH FPT)',
    location: 'TP. Hồ Chí Minh',
    currentSkills: ['React', 'TypeScript', 'HTML/CSS', 'Git'],
    strengths: ['Học nhanh công nghệ mới', 'Tự học chủ động'],
    weaknesses: ['Chưa có kinh nghiệm hệ thống lớn', 'Tiếng Anh kỹ thuật trung bình'],
    interests: ['AI/ML', 'Agent phát triển', 'Sản phẩm số'],
    forecastMode: 'optimistic',
    constraints: { budgetVND: 5000000, hoursPerWeekAvailable: 15, riskTolerance: 'high' }
  }, 'knowledge_worker'),
  p('persona-student', 'Bảo Ngọc - Final Year Student', {
    currentRole: 'Sinh viên năm cuối ngành Marketing',
    experienceYears: 0,
    education: 'Sinh viên Đại học Kinh tế TP.HCM (sắp tốt nghiệp)',
    location: 'TP. Hồ Chí Minh',
    currentSkills: ['Content cơ bản', 'Canva', 'Social media'],
    strengths: ['Nhiệt tình', 'Bắt trend nhanh', 'Tiếng Anh giao tiếp tốt'],
    weaknesses: ['Chưa có kinh nghiệm thực tế', 'Chưa thành thạo công cụ phân tích'],
    interests: ['Digital marketing', 'AI content', 'Thương hiệu'],
    forecastMode: 'optimistic',
    constraints: { budgetVND: 2000000, hoursPerWeekAvailable: 20, riskTolerance: 'high' }
  }, 'student'),
  p('persona-nurse', 'Lan Anh - Nurse', {
    currentRole: 'Điều dưỡng viên',
    experienceYears: 7,
    education: 'Cử nhân Điều dưỡng',
    location: 'Cần Thơ',
    currentSkills: ['Chăm sóc bệnh nhân', 'Tiêm truyền', 'Hồ sơ bệnh án điện tử'],
    strengths: ['Kiên nhẫn', 'Xử lý tình huống cấp cứu', 'Giao tiếp với bệnh nhân'],
    weaknesses: ['Áp lực ca trực', 'Ít cơ hội học công nghệ mới'],
    interests: ['Y tế số', 'Sức khỏe cộng đồng'],
    forecastMode: 'realistic',
    constraints: { budgetVND: 2500000, hoursPerWeekAvailable: 5, riskTolerance: 'low' }
  }, 'knowledge_worker'),
  p('persona-logistics', 'Văn Đức - Logistics Coordinator', {
    currentRole: 'Điều phối logistics xuất nhập khẩu',
    experienceYears: 5,
    education: 'Cử nhân Ngoại thương',
    location: 'Hải Phòng',
    currentSkills: ['Khai báo hải quan', 'Điều phối container', 'Excel', 'Giao tiếp nhà cung cấp'],
    strengths: ['Tổ chức tốt', 'Xử lý văn bản nhanh', 'Tiếng Anh thương mại'],
    weaknesses: ['Quy trình còn thủ công', 'Chưa số hóa báo cáo'],
    interests: ['Chuỗi cung ứng số', 'Phân tích dữ liệu vận hành'],
    forecastMode: 'realistic',
    constraints: { budgetVND: 3500000, hoursPerWeekAvailable: 8, riskTolerance: 'moderate' }
  }, 'wage_worker'),
  p('persona-farmer', 'Văn Bình - Rice Farmer', {
    currentRole: 'Nông dân trồng lúa',
    experienceYears: 20,
    education: 'Tiểu học',
    location: 'An Giang',
    currentSkills: ['Canh tác lúa theo mùa', 'Quản lý nước ruộng', 'Bán lúa cho thu mua'],
    strengths: ['Kinh nghiệm địa phương sâu', 'Chăm chỉ', 'Vượt qua điều kiện khắc nghiệt'],
    weaknesses: ['Mù chữ công nghệ', 'Không tiếng Anh', 'Phụ thuộc thương lái'],
    interests: ['Nông nghiệp sạch', 'Kinh doanh nông sản'],
    forecastMode: 'conservative',
    constraints: { budgetVND: 1000000, hoursPerWeekAvailable: 4, riskTolerance: 'low' }
  }, 'rural_agricultural'),

  // Challenging case: obscure occupation absent from the curated DB.
  // Expected honest behavior: weak/no occupation match, verifier flags missing
  // direct evidence, agent generalizes from adjacent occupations.
  p('persona-watchrepair', 'Đình Phúc - Watch Repairer', {
    currentRole: 'Thợ sửa chữa đồng hồ cơ',
    experienceYears: 15,
    education: 'Trung cấp kỹ thuật',
    location: 'Hà Nội',
    currentSkills: ['Sửa máy đồng hồ cơ', 'Đánh bóng vỏ', 'Phân biệt linh kiện Swiss/Japanese'],
    strengths: ['Độ chính xác tay nghề cao', 'Kiên nhẫn tuyệt đối', 'Uy tín với khách quen'],
    weaknesses: ['Thị trường đang thu hẹp', 'Không bán hàng online', 'Tuổi cao khó chuyển nghề'],
    interests: ['Đồng hồ cao cấp', 'Khởi nghiệp nhỏ'],
    forecastMode: 'conservative',
    constraints: { budgetVND: 3000000, hoursPerWeekAvailable: 6, riskTolerance: 'low' }
  }, 'craft_trade', true),

  p('persona-receptionist', 'Hồng Nhung - Office Receptionist', {
    currentRole: 'Lễ tân văn phòng',
    experienceYears: 4,
    education: 'Cao đẳng Văn thư - Lưu trữ',
    location: 'TP. Hồ Chí Minh',
    currentSkills: ['Tiếp khách và tổng đài', 'Sắp xếp lịch họp, email', 'Soạn thảo văn bản cơ bản', 'Excel cơ bản'],
    strengths: ['Giao tiếp thân thiện', 'Tổ chức công việc tốt', 'Nhanh nhẹn, chịu áp lực giờ cao điểm'],
    weaknesses: ['Kỹ năng tin học văn phòng còn hạn chế', 'Chưa quen công cụ họp trực tuyến', 'Tiếng Anh giao tiếp cơ bản'],
    interests: ['Hành chính nhân sự', 'Truyền thông nội bộ'],
    forecastMode: 'conservative',
    constraints: { budgetVND: 1500000, hoursPerWeekAvailable: 8, riskTolerance: 'low' }
  }, 'wage_worker'),
  p('persona-electrician', 'Bá Cường - Industrial Electrician', {
    currentRole: 'Thợ điện công nghiệp',
    experienceYears: 10,
    education: 'Trung cấp Điện công nghiệp',
    location: 'Hải Phòng',
    currentSkills: ['Bảo trì tủ điện, biến tần', 'Đọc bản vẽ điện', 'Xử lý sự cố đấu dây', 'An toàn điện'],
    strengths: ['Kinh nghiệm hiện trường phong phú', 'Tư duy logic xử lý sự cố', 'Chịu được ca kíp'],
    weaknesses: ['Chưa lập trình PLC', 'Tiếng Anh kỹ thuật hạn chế'],
    interests: ['Tự động hóa', 'Robot công nghiệp'],
    forecastMode: 'realistic',
    constraints: { budgetVND: 3000000, hoursPerWeekAvailable: 8, riskTolerance: 'moderate' }
  }, 'wage_worker'),
  p('persona-retailcashier', 'Mỹ Linh - Retail Cashier', {
    currentRole: 'Thu ngân siêu thị',
    experienceYears: 3,
    education: 'Trung học phổ thông',
    location: 'Đà Nẵng',
    currentSkills: ['Vận hành máy POS', 'Đối soát cuối ca', 'Chăm sóc khách hàng', 'Xử lý hoàn đổi hàng'],
    strengths: ['Cẩn thận với tiền và hóa đơn', 'Thái độ phục vụ tốt', 'Làm việc theo ca linh hoạt'],
    weaknesses: ['Kỹ năng số cơ bản', 'Chưa có kinh nghiệm văn phòng'],
    interests: ['Kế toán cơ bản', 'Bán hàng trực tuyến'],
    forecastMode: 'conservative',
    constraints: { budgetVND: 1500000, hoursPerWeekAvailable: 10, riskTolerance: 'low' }
  }, 'wage_worker'),
  p('persona-agritech', 'Văn Hậu - Tech-Adopting Farmer', {
    currentRole: 'Nông dân ứng dụng công nghệ',
    experienceYears: 15,
    education: 'Trung học phổ thông và các khóa nông nghiệp ngắn hạn',
    location: 'Cần Thơ',
    currentSkills: ['Canh tác lúa và cây ăn quả', 'Thao tác drone phun thuốc cơ bản', 'Bán nông sản qua Zalo và Facebook', 'Ghi chép chi phí đơn giản'],
    strengths: ['Sẵn sàng học công nghệ mới', 'Hiểu thị trường địa phương', 'Kiên trì theo mùa vụ'],
    weaknesses: ['Phân tích dữ liệu canh tác', 'Tiếng Anh'],
    interests: ['Nông nghiệp chính xác', 'Thương mại điện tử nông sản'],
    forecastMode: 'realistic',
    constraints: { budgetVND: 2500000, hoursPerWeekAvailable: 12, riskTolerance: 'moderate' }
  }, 'rural_agricultural')
];
