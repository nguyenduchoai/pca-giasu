// ============================================================================
// DỮ LIỆU NGHIỆP VỤ TOÀN DIỆN NỀN TẢNG OYLG (v1.0) – PHỤC VỤ 21 PHÂN HỆ M01..M21
// ============================================================================

import { UnitAssessmentScoreInput } from "@oylg/shared";

export interface StudentCaseProfile {
  id: string;
  code: string;
  fullName: string;
  grade: number;
  schoolName: string;
  province: string;
  parentName: string;
  parentPhoneMasked: string;
  coachName: string;
  careerGoal: {
    targetCareer: string;
    targetUniversity: string;
    admissionBlock: string;
    benchmarkScore: number;
    riasecCode: string;
    fitPercentage: number;
  };
  statusLight: "GREEN" | "YELLOW" | "RED";
  riskTrend: "IMPROVING" | "STABLE" | "WORSENING";
  riskScore: number;
  remedialRatio: { remedialPct: number; currentPct: number; advancedPct: number };
  weeklyLoadHours: number;
  maxAllowedLoadHours: number;
  attendanceRatePct: number;
  homeworkRatePct: number;
  recentMoods: string[];
  sessionCreditsRemaining: number;
  defaultDeliveryMode: "ONLINE_ZOOM" | "AT_CENTER" | "AT_HOME";
  residency?: {
    type: "BOARDING" | "DAY_BOARDING";
    facilityName: string;
    roomBed: string;
    allergies: string;
    sleepHoursAvg: number;
  };
  /** Điểm tầm soát theo mốc thời gian (Tuần 1 -> Tuần 4 -> Tuần 8 -> Tuần 12) cho Bản đồ nhiệt 4D */
  timelineMasterySnapshots: Record<number, UnitAssessmentScoreInput[]>;
}

export const STUDENT_CASES: StudentCaseProfile[] = [
  {
    id: "case-01",
    code: "HS-2026-0089",
    fullName: "Nguyễn Minh Khôi",
    grade: 9,
    schoolName: "THCS Nguyễn Du",
    province: "Đắk Lắk (Buôn Ma Thuột)",
    parentName: "Chị Nguyễn Thị Lan (Mẹ)",
    parentPhoneMasked: "0905.***.*89 (Đã ẩn theo Quy tắc #6)",
    coachName: "ThS. Lê Minh Tâm (Cố vấn cuộc sống)",
    careerGoal: {
      targetCareer: "Kỹ sư Trí tuệ Nhân tạo & Khoa học Dữ liệu",
      targetUniversity: "THPT Chuyên Nguyễn Du → ĐH Bách Khoa TP.HCM",
      admissionBlock: "A00 (Toán – Lý – Hóa) & A01 (Toán – Lý – Anh)",
      benchmarkScore: 27.5,
      riasecCode: "I-R-C (Nghiên cứu – Thực tế – Nghiệp vụ)",
      fitPercentage: 92,
    },
    statusLight: "YELLOW",
    riskTrend: "IMPROVING",
    riskScore: 42,
    remedialRatio: { remedialPct: 60, currentPct: 30, advancedPct: 10 },
    weeklyLoadHours: 9.5,
    maxAllowedLoadHours: 14,
    attendanceRatePct: 96,
    homeworkRatePct: 88,
    recentMoods: ["Tập trung cao", "Hứng thú", "Bình thường"],
    sessionCreditsRemaining: 18,
    defaultDeliveryMode: "AT_CENTER",
    residency: {
      type: "DAY_BOARDING",
      facilityName: "Cơ sở OYLG Trung tâm Buôn Ma Thuột",
      roomBed: "Phòng Bán trú B2 – Giường nghỉ trưa #08",
      allergies: "Dị ứng tôm/cua biển (cần suất ăn riêng)",
      sleepHoursAvg: 7.8,
    },
    timelineMasterySnapshots: {
      1: [
        { unitCode: "TOAN.07.SHT.02", pMastery: 0.82 },
        { unitCode: "TOAN.07.TLT.04", pMastery: 0.75 },
        { unitCode: "TOAN.08.HDT.01", pMastery: 0.32 }, // Lỗ hổng gốc ở Tuần 1
        { unitCode: "TOAN.08.PTB1.03", pMastery: 0.38 },
        { unitCode: "TOAN.09.CBH.01", pMastery: 0.24 },
        { unitCode: "TOAN.09.HPT.02", pMastery: 0.42 },
      ],
      4: [
        { unitCode: "TOAN.07.SHT.02", pMastery: 0.86 },
        { unitCode: "TOAN.07.TLT.04", pMastery: 0.80 },
        { unitCode: "TOAN.08.HDT.01", pMastery: 0.64 }, // Đang lấp nền (Vàng)
        { unitCode: "TOAN.08.PTB1.03", pMastery: 0.52 },
        { unitCode: "TOAN.09.CBH.01", pMastery: 0.45 },
        { unitCode: "TOAN.09.HPT.02", pMastery: 0.50 },
      ],
      8: [
        { unitCode: "TOAN.07.SHT.02", pMastery: 0.90 },
        { unitCode: "TOAN.07.TLT.04", pMastery: 0.85 },
        { unitCode: "TOAN.08.HDT.01", pMastery: 0.84 }, // Đã lấp xong lỗ hổng gốc Lớp 8!
        { unitCode: "TOAN.08.PTB1.03", pMastery: 0.76 }, // Đã lấp xong PT bậc nhất Lớp 8!
        { unitCode: "TOAN.09.CBH.01", pMastery: 0.66 }, // Đang tiến bộ nhanh
        { unitCode: "TOAN.09.HPT.02", pMastery: 0.62 },
      ],
      12: [
        { unitCode: "TOAN.07.SHT.02", pMastery: 0.94 },
        { unitCode: "TOAN.07.TLT.04", pMastery: 0.91 },
        { unitCode: "TOAN.08.HDT.01", pMastery: 0.92 },
        { unitCode: "TOAN.08.PTB1.03", pMastery: 0.89 },
        { unitCode: "TOAN.09.CBH.01", pMastery: 0.85 }, // Xanh toàn bộ!
        { unitCode: "TOAN.09.HPT.02", pMastery: 0.81 },
      ],
    },
  },
  {
    id: "case-02",
    code: "HS-2026-0104",
    fullName: "Trần Bảo Ngọc",
    grade: 11,
    schoolName: "THPT Lê Quý Đôn",
    province: "Đắk Lắk",
    parentName: "Anh Trần Quốc Tuấn (Bố)",
    parentPhoneMasked: "0913.***.*12 (Đã ẩn theo Quy tắc #6)",
    coachName: "ThS. Lê Minh Tâm (Cố vấn cuộc sống)",
    careerGoal: {
      targetCareer: "Bác sĩ Đa khoa / Tâm lý Lâm sàng",
      targetUniversity: "ĐH Y Dược TP.HCM",
      admissionBlock: "B00 (Toán – Hóa – Sinh)",
      benchmarkScore: 28.2,
      riasecCode: "I-S-R (Nghiên cứu – Xã hội – Thực tế)",
      fitPercentage: 89,
    },
    statusLight: "RED",
    riskTrend: "WORSENING",
    riskScore: 78,
    remedialRatio: { remedialPct: 50, currentPct: 40, advancedPct: 10 },
    weeklyLoadHours: 19.5,
    maxAllowedLoadHours: 15,
    attendanceRatePct: 82,
    homeworkRatePct: 65,
    recentMoods: ["Căng thẳng", "Mệt mỏi", "Căng thẳng"],
    sessionCreditsRemaining: 9,
    defaultDeliveryMode: "ONLINE_ZOOM",
    residency: {
      type: "BOARDING",
      facilityName: "Khu Nội trú OYLG Buôn Ma Thuột",
      roomBed: "Phòng Nội trú Nữ N302 – Giường #02",
      allergies: "Không dị ứng thực phẩm – Lưu ý thiếu ngủ trước kỳ thi",
      sleepHoursAvg: 5.6,
    },
    timelineMasterySnapshots: {
      1: [
        { unitCode: "TOAN.08.HDT.01", pMastery: 0.78 },
        { unitCode: "TOAN.08.PTB1.03", pMastery: 0.74 },
        { unitCode: "TOAN.09.CBH.01", pMastery: 0.72 },
        { unitCode: "TOAN.09.HPT.02", pMastery: 0.45 }, // Hổng Hệ PT & Vi-ét Lớp 9
        { unitCode: "TOAN.10.HSB2.01", pMastery: 0.35 },
        { unitCode: "TOAN.11.LG.01", pMastery: 0.28 },
      ],
      4: [
        { unitCode: "TOAN.08.HDT.01", pMastery: 0.80 },
        { unitCode: "TOAN.08.PTB1.03", pMastery: 0.76 },
        { unitCode: "TOAN.09.CBH.01", pMastery: 0.75 },
        { unitCode: "TOAN.09.HPT.02", pMastery: 0.58 },
        { unitCode: "TOAN.10.HSB2.01", pMastery: 0.48 },
        { unitCode: "TOAN.11.LG.01", pMastery: 0.38 },
      ],
      8: [
        { unitCode: "TOAN.08.HDT.01", pMastery: 0.82 },
        { unitCode: "TOAN.08.PTB1.03", pMastery: 0.79 },
        { unitCode: "TOAN.09.CBH.01", pMastery: 0.78 },
        { unitCode: "TOAN.09.HPT.02", pMastery: 0.74 },
        { unitCode: "TOAN.10.HSB2.01", pMastery: 0.64 },
        { unitCode: "TOAN.11.LG.01", pMastery: 0.52 },
      ],
      12: [
        { unitCode: "TOAN.08.HDT.01", pMastery: 0.88 },
        { unitCode: "TOAN.08.PTB1.03", pMastery: 0.84 },
        { unitCode: "TOAN.09.CBH.01", pMastery: 0.82 },
        { unitCode: "TOAN.09.HPT.02", pMastery: 0.81 },
        { unitCode: "TOAN.10.HSB2.01", pMastery: 0.78 },
        { unitCode: "TOAN.11.LG.01", pMastery: 0.75 },
      ],
    },
  },
  {
    id: "case-03",
    code: "HS-2026-0118",
    fullName: "Lê Hoàng Bách",
    grade: 4,
    schoolName: "Tiểu học Quốc tế Á Châu",
    province: "TP. Hồ Chí Minh (Online)",
    parentName: "Chị Phạm Thu Hà (Mẹ)",
    parentPhoneMasked: "0988.***.*45 (Đã ẩn theo Quy tắc #6)",
    coachName: "Cô Nguyễn Phương Thảo (Cố vấn cuộc sống)",
    careerGoal: {
      targetCareer: "Khám phá Khoa học Tự nhiên & Sáng tạo Robot",
      targetUniversity: "Nền tảng THCS Chất lượng cao Trần Đại Nghĩa",
      admissionBlock: "Toán Tư duy – Tiếng Anh – Khoa học",
      benchmarkScore: 85,
      riasecCode: "I-A-R (Khám phá – Sáng tạo – Thực hành)",
      fitPercentage: 95,
    },
    statusLight: "GREEN",
    riskTrend: "IMPROVING",
    riskScore: 12,
    remedialRatio: { remedialPct: 30, currentPct: 50, advancedPct: 20 },
    weeklyLoadHours: 4.5,
    maxAllowedLoadHours: 8,
    attendanceRatePct: 100,
    homeworkRatePct: 100,
    recentMoods: ["Hào hứng", "Vui vẻ", "Tập trung cao"],
    sessionCreditsRemaining: 22,
    defaultDeliveryMode: "ONLINE_ZOOM",
    timelineMasterySnapshots: {
      1: [
        { unitCode: "TOAN.06.PS.01", pMastery: 0.65 },
        { unitCode: "TOAN.07.SHT.02", pMastery: 0.72 },
      ],
      4: [
        { unitCode: "TOAN.06.PS.01", pMastery: 0.78 },
        { unitCode: "TOAN.07.SHT.02", pMastery: 0.80 },
      ],
      8: [
        { unitCode: "TOAN.06.PS.01", pMastery: 0.88 },
        { unitCode: "TOAN.07.SHT.02", pMastery: 0.86 },
      ],
      12: [
        { unitCode: "TOAN.06.PS.01", pMastery: 0.95 },
        { unitCode: "TOAN.07.SHT.02", pMastery: 0.92 },
      ],
    },
  },
];

// ----------------------------------------------------------------------------
// M04.3 – HÀNG ĐỢI DUYỆT HỌC LIỆU & CÂU HỎI AI SINH (CHO CỐ VẤN TRACIE ANH & TRƯỞNG MÔN)
// ----------------------------------------------------------------------------

export interface ReviewableQuestionItem {
  id: string;
  code: string;
  toolkit: "B1_CAREER" | "B2_KNOWLEDGE" | "B3_MENTAL" | "B4_PHYSICAL_SKILLS";
  subject: string;
  gradeRange: string;
  yccdCode: string;
  questionType: string;
  stem: string;
  formulaLatex?: string;
  options: string[];
  correctAnswer?: string;
  aiConfidence: number;
  subjectLeadReviewer: string;
  subjectLeadStatus: "VERIFIED_BY_LEAD" | "PENDING_LEAD";
  finalApprovalStatus: "PENDING_TRACIE_ANH" | "APPROVED" | "RETURNED";
  statsFlag?: string;
  isSafetyTrigger?: boolean;
}

export const APPROVAL_QUEUE_ITEMS: ReviewableQuestionItem[] = [
  {
    id: "q-01",
    code: "Q-B2-TOAN09-CBH-042",
    toolkit: "B2_KNOWLEDGE",
    subject: "Toán (Lớp 9)",
    gradeRange: "Lớp 9 (Ôn vào 10)",
    yccdCode: "TOAN.09.CBH.01 (Tiên quyết: TOAN.08.HDT.01)",
    questionType: "Trắc nghiệm chẩn đoán lỗ hổng kép",
    stem: "Rút gọn biểu thức chứa căn thức bậc hai kết hợp hằng đẳng thức bình phương một hiệu:",
    formulaLatex: "P = \\sqrt{(x - 3)^2} + \\frac{x^2 - 9}{x + 3} \\quad (\\text{với } x < 3, x \\neq -3)",
    options: [
      "A. P = 0 (Bẫy quên trị tuyệt đối |x - 3| = 3 - x khi x < 3)",
      "B. P = 2x - 6 (Đáp án đúng – Nắm vững cả ĐKXĐ và Hằng đẳng thức lớp 8)",
      "C. P = 6 - 2x (Sai dấu khi rút gọn phân thức x² - 9)",
      "D. P = 2x (Quên phân tích hằng đẳng thức hiệu hai bình phương)",
    ],
    correctAnswer: "B. P = 2x - 6",
    aiConfidence: 97,
    subjectLeadReviewer: "Thầy Đặng Quốc Việt (Trưởng môn Toán – Gia sư Cấp 3)",
    subjectLeadStatus: "VERIFIED_BY_LEAD",
    finalApprovalStatus: "PENDING_TRACIE_ANH",
  },
  {
    id: "q-02",
    code: "Q-B1-RIASEC-I-019",
    toolkit: "B1_CAREER",
    subject: "Hướng nghiệp (B1)",
    gradeRange: "Lớp 8 – Lớp 12",
    yccdCode: "DIM.RIASEC.INVESTIGATIVE + VALUE.AUTONOMY",
    questionType: "Tình huống phân hóa nghề nghiệp (Adaptive)",
    stem: "Khi gặp một thiết bị công nghệ hoặc bài toán hóc búa bị lỗi chưa rõ nguyên nhân, phản ứng tự nhiên nhất của em là gì?",
    options: [
      "1. Tự tách nhỏ từng giả thuyết, tra cứu nguyên lý gốc để tìm ra bằng được nguyên nhân (I - Nghiên cứu)",
      "2. Tháo lắp thử nghiệm trực tiếp bằng dụng cụ thực hành ngay lập tức (R - Thực tế)",
      "3. Tổ chức nhóm bạn cùng thảo luận và phân công người có thế mạnh xử lý (E - Quản lý)",
      "4. Viết lại quy trình hướng dẫn dễ hiểu để giúp các bạn khác không gặp lỗi tương tự (S - Xã hội)",
    ],
    aiConfidence: 95,
    subjectLeadReviewer: "ThS. Nguyễn Thanh Hương (Trưởng mảng Hướng nghiệp)",
    subjectLeadStatus: "VERIFIED_BY_LEAD",
    finalApprovalStatus: "PENDING_TRACIE_ANH",
  },
  {
    id: "q-03",
    code: "Q-B3-MENTAL-SAFE-008",
    toolkit: "B3_MENTAL",
    subject: "Tầm soát Tinh thần (B3)",
    gradeRange: "Lớp 6 – Lớp 12",
    yccdCode: "B3.BURNOUT.SLEEP + M14.SAFETY_SCREEN",
    questionType: "Thang đo 1–5 + Câu kích hoạt Cờ an toàn (M14)",
    stem: "Trong 2 tuần gần đây, tần suất em cảm thấy kiệt sức hoàn toàn, mất ngủ kéo dài hoặc có suy nghĩ muốn buông xuôi mọi thứ là như thế nào?",
    options: [
      "Mức 1: Hoàn toàn không có – Em ngủ tốt và giữ nhịp sinh hoạt bình thường",
      "Mức 2: Thỉnh thoảng (1–2 buổi tối khi sát ngày kiểm tra)",
      "Mức 3: Khá thường xuyên (3–4 ngày/tuần) → Tự động gắn cờ THEO DÕI (LOW)",
      "Mức 4–5: Hầu như mỗi ngày / Có ý nghĩ tự làm đau bản thân → KÍCH HOẠT NGAY CỜ ĐỎ M14 & HOTLINE 111",
    ],
    aiConfidence: 99,
    subjectLeadReviewer: "Chuyên gia Tâm lý Học đường OYLG",
    subjectLeadStatus: "VERIFIED_BY_LEAD",
    finalApprovalStatus: "PENDING_TRACIE_ANH",
    isSafetyTrigger: true,
  },
  {
    id: "q-04",
    code: "Q-B2-ANH10-COND-031",
    toolkit: "B2_KNOWLEDGE",
    subject: "Tiếng Anh (Lớp 10)",
    gradeRange: "Lớp 9 – Lớp 12",
    yccdCode: "ANH.10.GRAM.COND3 (Tiên quyết: ANH.08.PAST_PERFECT)",
    questionType: "Trắc nghiệm 1 đáp án",
    stem: "Choose the correct form to express an unreal past condition: 'If Minh _____ the foundational algebra formulas in Grade 8, he would not have struggled with the Grade 10 mock test.'",
    options: [
      "A. mastered",
      "B. had mastered (Đúng – Câu điều kiện loại 3 kết hợp Quá khứ hoàn thành lớp 8)",
      "C. has mastered",
      "D. would master",
    ],
    correctAnswer: "B. had mastered",
    aiConfidence: 88,
    subjectLeadReviewer: "Cô Lê Bảo Trâm (Trưởng môn Tiếng Anh – Gia sư Cấp 3)",
    subjectLeadStatus: "VERIFIED_BY_LEAD",
    finalApprovalStatus: "PENDING_TRACIE_ANH",
    statsFlag: "Cờ thống kê tự động: Độ phân biệt IRT âm (D = -0.14) trên 32 lượt thử nghiệm – Cần rà lại phương án nhiễu C",
  },
];

// ----------------------------------------------------------------------------
// M20.13 – THƯ VIỆN GIẢI PHÁP & KHO TÀI LIỆU CHÍNH THỐNG CÓ TRÍCH DẪN NGUỒN (RAG)
// ----------------------------------------------------------------------------

export interface RagPlaybookRecommendation {
  id: string;
  studentCode: string;
  riskTitle: string;
  severity: "YELLOW" | "RED";
  personalizedRecommendation: string;
  roleActions: {
    coach: string;
    tutor: string;
    parent: string;
  };
  citations: Array<{
    docCode: string;
    title: string;
    issuer: string;
    sectionRef: string;
    approvedBy: string;
  }>;
  status: "SUGGESTED" | "APPLIED" | "DISMISSED";
}

export const RAG_PLAYBOOK_RECOMMENDATIONS: RagPlaybookRecommendation[] = [
  {
    id: "rec-01",
    studentCode: "HS-2026-0089",
    riskTitle: "Bế tắc YCCĐ Căn bậc hai Lớp 9 do hổng Hằng đẳng thức Lớp 8",
    severity: "YELLOW",
    personalizedRecommendation:
      "Kết quả tầm soát chỉ ra [HS-2026-0089] làm sai 2 lần liên tiếp ở TOAN.09.CBH.01 không phải do không hiểu định nghĩa căn bậc hai, mà do hổng gốc ở TOAN.08.HDT.01 (Hằng đẳng thức số 1, 2, 3). Đề xuất lùi 3 buổi về luồng Bổ trợ Lớp 8 trước khi giải đề rút gọn Lớp 9.",
    roleActions: {
      coach: "Duyệt điều chỉnh tỉ lệ luồng môn Toán sang 70% Bổ trợ / 30% Hiện tại trong 2 tuần tới.",
      tutor: "Dùng sơ đồ diện tích hình vuông trực quan để dạy lại 3 hằng đẳng thức đầu tiên; giao bài Exit Check 5 phút cuối buổi.",
      parent: "Khích lệ nỗ lực lấp nền của con, không so sánh điểm kiểm tra hiện tại với bạn cùng lớp.",
    },
    citations: [
      {
        docCode: "PLAYBOOK-OYLG-01",
        title: "Thư viện Giải pháp OYLG: Xử lý Hổng Kiến Thức Gốc Xuyên Cấp",
        issuer: "Hội đồng Chuyên môn OYLG (Cố vấn Tracie Anh phê duyệt)",
        sectionRef: "Mục 2.1 – Nguyên tắc Truy ngược Đồ thị Tiên quyết (60/40)",
        approvedBy: "Cố vấn Tracie Anh (01/11/2026)",
      },
      {
        docCode: "MOET-GDPT2018-TOAN",
        title: "Chương trình Giáo dục Phổ thông Môn Toán (Ban hành kèm Thông tư 32/2018/TT-BGDĐT)",
        issuer: "Bộ Giáo dục và Đào tạo",
        sectionRef: "Trang 48–54: Mạch Đại số THCS – Yêu cầu cần đạt Biểu thức Đại số Lớp 8 & Căn thức Lớp 9",
        approvedBy: "Cố vấn Tracie Anh (01/11/2026)",
      },
    ],
    status: "SUGGESTED",
  },
  {
    id: "rec-02",
    studentCode: "HS-2026-0104",
    riskTitle: "Quá tải giờ học (19.5h/tuần > ngưỡng 15h) + Tâm trạng căng thẳng 3 buổi liên tiếp",
    severity: "RED",
    personalizedRecommendation:
      "Học sinh [HS-2026-0104] đang có tổng tải học thêm 19.5 giờ/tuần kết hợp giấc ngủ tại khu Nội trú giảm còn 5.6 giờ/đêm (dữ liệu liên thông từ M21) và 3 biên bản liên tiếp ghi nhận 'Căng thẳng/Mệt mỏi'. Cần kích hoạt ngay phác đồ giảm tải trước khi dẫn đến kiệt sức học đường.",
    roleActions: {
      coach: "Cắt giảm tạm thời 2 buổi nâng cao/tuần; hẹn phiên Coaching 1-1 lắng nghe áp lực mục tiêu Y Dược; kiểm tra 2 lớp hiển thị B3.",
      tutor: "Tạm dừng giao bài tập về nhà nâng cao trong 7 ngày; chuyển sang ôn nhẹ tại lớp.",
      parent: "Phối hợp cùng Quản sinh Nội trú đảm bảo con tắt thiết bị và ngủ trước 22:30.",
    },
    citations: [
      {
        docCode: "PLAYBOOK-OYLG-04",
        title: "Thư viện Giải pháp OYLG: Cân Bằng Tải Học Tập & Phòng Ngừa Kiệt Sức (Burnout)",
        issuer: "Hội đồng Chuyên môn Tâm lý & Cố vấn Cuộc sống OYLG",
        sectionRef: "Mục 4.3 – Ngưỡng tải học tập tối đa và can thiệp giấc ngủ Nội trú",
        approvedBy: "Cố vấn Tracie Anh (01/11/2026)",
      },
      {
        docCode: "UNICEF-MOET-2024",
        title: "Hướng dẫn Công tác Tư vấn Tâm lý và Chăm sóc Sức khỏe Tinh thần Học sinh Phổ thông",
        issuer: "Bộ GD&ĐT phối hợp cùng UNICEF Việt Nam",
        sectionRef: "Chương 3, Mục 3.2: Nhận diện sớm căng thẳng thi cử và nguyên tắc phối hợp Gia đình – Nhà trường",
        approvedBy: "Chuyên gia Tâm lý OYLG (02/11/2026)",
      },
    ],
    status: "SUGGESTED",
  },
];

// ----------------------------------------------------------------------------
// M09.2 – LỚP NHÓM CHỜ KHAI GIẢNG (ĐỦ SĨ SỐ MỚI KHAI GIẢNG, GHÉP THEO LỖ HỔNG TƯƠNG ĐỒNG)
// ----------------------------------------------------------------------------

export interface WaitingClassGroup {
  id: string;
  code: string;
  title: string;
  subject: string;
  grade: number;
  classType: "SMALL_GROUP" | "LARGE_GROUP";
  mode: "ONLINE_ZOOM" | "AT_CENTER";
  tutorName: string;
  tutorTier: 1 | 2 | 3;
  sharedGapUnits: string[];
  minSize: number;
  maxSize: number;
  enrolledCount: number;
  launchDeadline: string;
  scheduleText: string;
  status: "WAITING_MIN_SIZE" | "READY_TO_LAUNCH" | "LAUNCHED";
}

export const WAITING_CLASS_GROUPS: WaitingClassGroup[] = [
  {
    id: "cg-01",
    code: "GRP-TOAN09-HDT-01",
    title: "Nhóm nhỏ Lấp nền Đại số 8 → Căn thức 9 (Ghép theo lỗ hổng YCCĐ tương đồng)",
    subject: "Toán",
    grade: 9,
    classType: "SMALL_GROUP",
    mode: "ONLINE_ZOOM",
    tutorName: "Thầy Đặng Quốc Việt (Gia sư Cấp 3)",
    tutorTier: 3,
    sharedGapUnits: ["TOAN.08.HDT.01", "TOAN.08.PTB1.03", "TOAN.09.CBH.01"],
    minSize: 3,
    maxSize: 5,
    enrolledCount: 3,
    launchDeadline: "15/11/2026",
    scheduleText: "Thứ 3 & Thứ 5 (19:30 – 21:00) qua Zoom Công ty OYLG",
    status: "READY_TO_LAUNCH",
  },
  {
    id: "cg-02",
    code: "GRP-ANH08-GRAM-02",
    title: "Nhóm nhỏ Ngữ pháp Trọng tâm THCS (Thì Hoàn thành & Câu bị động)",
    subject: "Tiếng Anh",
    grade: 8,
    classType: "SMALL_GROUP",
    mode: "AT_CENTER",
    tutorName: "Cô Lê Bảo Trâm (Gia sư Cấp 2)",
    tutorTier: 2,
    sharedGapUnits: ["ANH.07.PAST_SIMPLE", "ANH.08.PRESENT_PERFECT"],
    minSize: 3,
    maxSize: 5,
    enrolledCount: 2,
    launchDeadline: "18/11/2026",
    scheduleText: "Thứ 7 & Chủ Nhật (08:30 – 10:00) tại Phòng P201 – Trung tâm BMT",
    status: "WAITING_MIN_SIZE",
  },
];

// ----------------------------------------------------------------------------
// M19.1 – KHO CÂU TRẢ LỜI ĐÃ DUYỆT CHO TRỢ LÝ AI CSKH 24/7 (KB_ANSWERS)
// ----------------------------------------------------------------------------

export interface ApprovedKbAnswer {
  id: string;
  topic: string;
  triggers: string[];
  approvedAnswer: string;
  generativeCardType?: "RESCHEDULE_CARD" | "MODE_SWITCH_CARD" | "PAYOS_QR_CARD" | "HUMAN_TICKET_CARD";
  approvedBy: string;
  version: string;
}

export const APPROVED_KB_ANSWERS: ApprovedKbAnswer[] = [
  {
    id: "kb-01",
    topic: "Quy định dời lịch & hủy buổi học (M09.1 & B3-27)",
    triggers: ["dời lịch", "đổi lịch", "nghỉ học", "bận", "hủy buổi"],
    approvedAnswer:
      "Theo quy định chính thức của OYLG (Mục 9.1): Phụ huynh báo trước tối thiểu 12 giờ so với giờ bắt đầu buổi học sẽ được dời lịch miễn phí (tối đa 2 lần dời/tháng/môn). Em đã kiểm tra hồ sơ của bé Nguyễn Minh Khôi: tháng này gia đình mới dời 0/2 lần. Anh/chị có thể bấm trực tiếp trên Thẻ Dời Lịch bên dưới để chọn khung giờ mới ạ!",
    generativeCardType: "RESCHEDULE_CARD",
    approvedBy: "AI_SUPERVISOR (Trần Thanh Tùng) – v1.4",
    version: "v1.4",
  },
  {
    id: "kb-02",
    topic: "Đổi hình thức học Online Zoom ↔ Tại trung tâm ↔ Tại nhà (M09.1)",
    triggers: ["đổi hình thức", "học online", "zoom", "tại nhà", "trung tâm"],
    approvedAnswer:
      "Tại OYLG, gia đình có thể đổi hình thức học linh hoạt theo từng buổi (Online Zoom ↔ Tại trung tâm ↔ Tại nhà học sinh) bất cứ lúc nào khi hai bên đồng ý. Hệ thống sẽ tự động tính phần chênh lệch theo hệ số (Online 1.0x | Trung tâm 1.2x | Tại nhà 1.5x) và cộng/trừ trực tiếp vào Ví buổi học của con.",
    generativeCardType: "MODE_SWITCH_CARD",
    approvedBy: "AI_SUPERVISOR (Trần Thanh Tùng) – v1.2",
    version: "v1.2",
  },
  {
    id: "kb-03",
    topic: "Thanh toán học phí & Ưu đãi đóng dài hạn (M10 & B3-25)",
    triggers: ["thanh toán", "đóng tiền", "học phí", "qr", "ưu đãi", "gia hạn"],
    approvedAnswer:
      "Mọi khoản học phí đều thanh toán chính thống qua tài khoản Công ty All Your Life (OYLG) bằng mã VietQR PayOS tự động đối soát (tuyệt đối không chuyển khoản cá nhân). Chính sách ưu đãi đóng dài hạn hiện hành: Đóng 3 tháng giảm 3%, 6 tháng giảm 7%, 12 tháng giảm 12%.",
    generativeCardType: "PAYOS_QR_CARD",
    approvedBy: "ACCOUNTANT & AI_SUPERVISOR – v1.0",
    version: "v1.0",
  },
];
