// ============================================================================
// CORE DOMAIN TYPES & RBAC DEFINITIONS – OYLG PLATFORM (v1.0)
// ============================================================================

export type RoleCode =
  | "PARENT"
  | "STUDENT"
  | "CAREER_EXPERT"
  | "LIFE_COACH"
  | "SUBJECT_EXPERT"
  | "ADMIN"
  | "CONTENT_EDITOR"
  | "ACCOUNTANT"
  | "SALES_LEADER"
  | "SALES_AGENT"
  | "OFFICE_STAFF"
  | "CARE_AGENT"
  | "CARE_LEAD"
  | "AI_SUPERVISOR"
  | "SUBJECT_LEAD"
  | "CONTENT_APPROVER"
  | "BOARDING_MANAGER"
  | "BOARDING_STAFF"
  | "SUPER_ADMIN"
  | "TENANT_ADMIN";

export type SubjectCode = "TOAN" | "LY" | "HOA" | "ANH" | "VAN";

export type ToolkitCode =
  | "B1_CAREER"
  | "B2_KNOWLEDGE"
  | "B3_MENTAL"
  | "B4_PHYSICAL_SKILLS";

export type DeliveryMode = "ONLINE_ZOOM" | "AT_CENTER" | "AT_HOME";

export type ClassType = "ONE_ON_ONE" | "SMALL_GROUP" | "LARGE_GROUP";

export type ExpertTier = 1 | 2 | 3;

export type GradeBracket =
  | "PRIMARY_1_5"
  | "MIDDLE_6_8"
  | "HIGH_10_11"
  | "EXAM_PREP_9_12";

export type BillingTermMonths = 1 | 3 | 6 | 12;

export type SafetyLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH";

export type HealthLight = "GREEN" | "YELLOW" | "RED";

export interface RoleMetadata {
  code: RoleCode;
  label: string;
  portalGroup:
    | "EXECUTIVE"
    | "COACH_EXPERT"
    | "CONTENT_STUDIO"
    | "FAMILY_PARENT"
    | "STUDENT_SPACE"
    | "SALES_CARE_BOARDING";
  description: string;
  modules: string[];
}

export const OYLG_ROLES: RoleMetadata[] = [
  {
    code: "ADMIN",
    label: "Quản trị & Điều hành (Admin)",
    portalGroup: "EXECUTIVE",
    description: "Điều phối tiếp nhận (M03), cấu hình bảng giá hệ số (B6), quản lý chuyên gia & 4 chỉ số buổi sáng",
    modules: ["M01", "M03", "M08", "M10", "M11", "M13", "M15", "M16"],
  },
  {
    code: "LIFE_COACH",
    label: "Cố vấn Cuộc sống (Chủ hồ sơ)",
    portalGroup: "COACH_EXPERT",
    description: "Tầm soát 3 mặt (B2-B4), duyệt Báo cáo R2/R3/R4, lập Lộ trình 60/40, Tháp điều khiển giám sát M20 & xử lý cờ M14",
    modules: ["M05", "M06", "M07", "M09", "M13", "M14", "M20"],
  },
  {
    code: "SUBJECT_EXPERT",
    label: "Chuyên gia Bộ môn (Gia sư)",
    portalGroup: "COACH_EXPERT",
    description: "Lập kế hoạch môn 3 luồng, dạy theo YCCĐ, ghi biên bản 60s trong 24h, ra đề & chấm kiểm tra trên nền tảng",
    modules: ["M08", "M09", "M11", "M20"],
  },
  {
    code: "CAREER_EXPERT",
    label: "Chuyên gia Hướng nghiệp",
    portalGroup: "COACH_EXPERT",
    description: "Dẫn dắt phiên hướng nghiệp thích ứng (B1), duyệt Báo cáo R1 & Bản đồ thành công",
    modules: ["M04", "M05", "M06", "M09"],
  },
  {
    code: "CONTENT_APPROVER",
    label: "Cố vấn Tracie Anh (Duyệt cuối)",
    portalGroup: "CONTENT_STUDIO",
    description: "Duyệt cuối bộ công cụ B1–B4, ngân hàng câu hỏi AI sinh và đồ thị YCCĐ chương trình GDPT 2018",
    modules: ["M04", "M14", "M20"],
  },
  {
    code: "SUBJECT_LEAD",
    label: "Trưởng môn kiêm duyệt (Gia sư Cấp 3)",
    portalGroup: "CONTENT_STUDIO",
    description: "Rà soát chuyên môn câu hỏi & YCCĐ của môn mình trước khi chuyển Cố vấn Tracie Anh duyệt cuối",
    modules: ["M04", "M11"],
  },
  {
    code: "PARENT",
    label: "Phụ huynh",
    portalGroup: "FAMILY_PARENT",
    description: "Xem bản đồ nhiệt tiến độ 4D, nhận 1 tin tổng hợp/ngày, đổi hình thức học từng buổi, chat Trợ lý AI CSKH 24/7",
    modules: ["M02", "M06", "M07", "M09", "M10", "M12", "M13", "M19", "M21"],
  },
  {
    code: "STUDENT",
    label: "Học sinh (Lớp 1–12)",
    portalGroup: "STUDENT_SPACE",
    description: "Làm bài tầm soát thích ứng, xem Bản đồ thành công, làm bài kiểm tra gắn YCCĐ & học cùng Socratic AI",
    modules: ["M02", "M05", "M07", "M13", "M20"],
  },
  {
    code: "SALES_LEADER",
    label: "Trưởng nhóm Bán hàng (Leader)",
    portalGroup: "SALES_CARE_BOARDING",
    description: "Quản lý nhóm CTV, bán trực tiếp (15%) hoặc nhận thù lao quản lý nhóm (5%), POS sự kiện & theo dõi hoa hồng chi dần",
    modules: ["M10", "M18"],
  },
  {
    code: "CARE_AGENT",
    label: "Chăm sóc Khách hàng & AI Supervisor",
    portalGroup: "SALES_CARE_BOARDING",
    description: "Hồ sơ gia đình 360°, kịch bản điểm chạm tự sinh, giám sát Trợ lý AI CSKH 24/7 & quản lý kho câu trả lời đã duyệt",
    modules: ["M12", "M19"],
  },
  {
    code: "BOARDING_MANAGER",
    label: "Quản lý & Quản sinh Nội trú / Bán trú",
    portalGroup: "SALES_CARE_BOARDING",
    description: "Quản lý phòng/giường, điểm danh QR 4 mốc, xác thực ảnh người đón an toàn, thực đơn dị ứng & nhật ký sức khỏe (M21)",
    modules: ["M20", "M21"],
  },
];
