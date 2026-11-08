"use client";

import React, { createContext, useContext, useState } from "react";
import {
  DeliveryMode,
  ClassType,
  ExpertTier,
  calculateOrderCommissionPlan,
} from "@oylg/shared";
import {
  STUDENT_CASES,
  StudentCaseProfile,
  APPROVAL_QUEUE_ITEMS,
  ReviewableQuestionItem,
  WAITING_CLASS_GROUPS,
  WaitingClassGroup,
  RAG_PLAYBOOK_RECOMMENDATIONS,
  RagPlaybookRecommendation,
} from "@/data/oylg-mock-data";

export type ActivePersonaId =
  | "PARENT_LAN"
  | "STUDENT_KHOI"
  | "COACH_TAM"
  | "TUTOR_VIET"
  | "APPROVER_TRACIE"
  | "SALES_LEADER_MINH"
  | "CARE_AGENT_HA"
  | "BOARDING_STAFF_NAM"
  | "ADMIN_OYLG";

export interface PersonaAccount {
  id: ActivePersonaId;
  fullName: string;
  roleTitle: string;
  roleCode: string;
  avatarInitials: string;
  avatarBg: string;
  defaultRoute: string;
  portalName: string;
  portalGroup: "PARENT" | "STUDENT" | "EXPERT" | "ENTERPRISE_ADMIN";
}

export const PERSONA_ACCOUNTS: PersonaAccount[] = [
  {
    id: "PARENT_LAN",
    fullName: "Chị Nguyễn Thị Lan",
    roleTitle: "Phụ huynh em Nguyễn Minh Khôi (Lớp 9)",
    roleCode: "Phụ huynh",
    avatarInitials: "NL",
    avatarBg: "bg-indigo-600",
    defaultRoute: "/parent",
    portalName: "Cổng Đồng Hành Phụ Huynh",
    portalGroup: "PARENT",
  },
  {
    id: "STUDENT_KHOI",
    fullName: "Nguyễn Minh Khôi",
    roleTitle: "Học sinh Lớp 9 · THCS Nguyễn Du",
    roleCode: "Học sinh",
    avatarInitials: "MK",
    avatarBg: "bg-sky-600",
    defaultRoute: "/student",
    portalName: "Không Gian Học Tập Học Sinh",
    portalGroup: "STUDENT",
  },
  {
    id: "COACH_TAM",
    fullName: "ThS. Lê Minh Tâm",
    roleTitle: "Cố vấn Cuộc sống & Chuyên gia Hướng nghiệp",
    roleCode: "Cố vấn",
    avatarInitials: "MT",
    avatarBg: "bg-emerald-600",
    defaultRoute: "/coach",
    portalName: "Không Gian Cố Vấn & Chuyên Gia",
    portalGroup: "EXPERT",
  },
  {
    id: "TUTOR_VIET",
    fullName: "Thầy Đặng Quốc Việt",
    roleTitle: "Chuyên gia Bộ môn Toán (Cấp 3 · Trưởng môn)",
    roleCode: "Gia sư bộ môn",
    avatarInitials: "QV",
    avatarBg: "bg-teal-600",
    defaultRoute: "/coach/sessions",
    portalName: "Sổ Đầu Bài & Giảng Dạy Bộ Môn",
    portalGroup: "EXPERT",
  },
  {
    id: "APPROVER_TRACIE",
    fullName: "Cố vấn Tracie Anh",
    roleTitle: "Chủ tịch Hội đồng Chuyên môn · Phê duyệt Học liệu",
    roleCode: "Hội đồng Chuyên môn",
    avatarInitials: "TA",
    avatarBg: "bg-purple-600",
    defaultRoute: "/studio",
    portalName: "Quản Trị Học Liệu & Phê Duyệt Nội Dung",
    portalGroup: "ENTERPRISE_ADMIN",
  },
  {
    id: "SALES_LEADER_MINH",
    fullName: "Phạm Hoàng Minh",
    roleTitle: "Trưởng nhóm Tư vấn Tuyển sinh & Đối tác",
    roleCode: "Quản lý Tuyển sinh",
    avatarInitials: "HM",
    avatarBg: "bg-rose-600",
    defaultRoute: "/operations/sales",
    portalName: "Quản Trị Tuyển Sinh, POS & Hoa Hồng",
    portalGroup: "ENTERPRISE_ADMIN",
  },
  {
    id: "BOARDING_STAFF_NAM",
    fullName: "Thầy Vũ Hải Nam",
    roleTitle: "Quản lý Nội trú & Bán trú Cơ sở Buôn Ma Thuột",
    roleCode: "Quản lý Nội trú",
    avatarInitials: "HN",
    avatarBg: "bg-amber-600",
    defaultRoute: "/operations/boarding",
    portalName: "Quản Trị Nội Trú, Bán Trú & Đưa Đón",
    portalGroup: "ENTERPRISE_ADMIN",
  },
  {
    id: "ADMIN_OYLG",
    fullName: "Ban Điều Hành OYLG",
    roleTitle: "Giám đốc Vận hành & Quản trị Hệ thống",
    roleCode: "Quản trị viên",
    avatarInitials: "AD",
    avatarBg: "bg-slate-900",
    defaultRoute: "/admin",
    portalName: "Trung Tâm Quản Trị Doanh Nghiệp OYLG",
    portalGroup: "ENTERPRISE_ADMIN",
  },
];

export interface EzyPageFragmentItem {
  pageName: "common" | "home" | "about_us" | "footer";
  fragmentName: string;
  titleVi: string;
  contentVi: string;
  updatedAt: string;
}

export interface EzyTeamMemberProfile {
  slug: string;
  name: string;
  roleTitle: string;
  ezyRole: string;
  expertTier: "Chuyên gia Trưởng môn (Cấp 3)" | "Chuyên gia Cao cấp (Cấp 2)" | "Chuyên gia Chuẩn (Cấp 1)";
  subjects: string[];
  modes: string[];
  rating: number;
  studentsCount: number;
  achievementSummary: string;
  bio: string;
  education: string[];
  avatarBg: string;
  initials: string;
}

export interface EcommerceProductItem {
  id: string;
  code: string;
  tierLabel: string;
  title: string;
  subtitle: string;
  listPriceVnd: number;
  netPriceVnd: number;
  discountTag?: string;
  sessionsGranted: number;
  sixMonthReferenceValueVnd: number;
  highlights: string[];
}

export interface EcommerceCartItem {
  product: EcommerceProductItem;
  quantity: number;
  customNote?: string;
}

export interface EcommerceOrderRecord {
  id: string;
  orderCode: string;
  parentName: string;
  phone: string;
  studentCode: string;
  studentName: string;
  itemsSummary: string;
  subtotalVnd: number;
  voucherCode?: string;
  voucherDiscountVnd: number;
  netPaidVnd: number;
  sixMonthReferenceVnd: number;
  sessionsGranted: number;
  sessionsConsumed: number;
  refCode?: string;
  channel: "WEBSITE_ECOM" | "PARENT_PORTAL" | "POS_COUNTER";
  paymentMethod: "VIETQR_PAYOS" | "BANK_TRANSFER";
  status: "PAID" | "PENDING_PAYMENT" | "REFUNDED_14D";
  refundAmountVnd?: number;
  tier1RepCommissionVnd: number;
  tier2LeaderCommissionVnd: number;
  createdAt: string;
}

export const INITIAL_ECOMMERCE_PRODUCTS: EcommerceProductItem[] = [
  {
    id: "pkg-tier1-career",
    code: "PKG-TIER1-CAREER",
    tierLabel: "Tầng 1 · Định Hướng Nghề Nghiệp",
    title: "Gói Khám Phá Bản Thân & Định Hướng Nghề Nghiệp (B1 + Báo Cáo R1)",
    subtitle: "Trắc nghiệm đa chiều RIASEC + Big Five, Bản đồ 3 hướng nghề nghiệp và 1 buổi tham vấn 1-1 (60 phút) cùng Chuyên gia Hướng nghiệp.",
    listPriceVnd: 1_800_000,
    netPriceVnd: 1_500_000,
    discountTag: "Ưu đãi khởi đầu",
    sessionsGranted: 1,
    sixMonthReferenceValueVnd: 1_500_000,
    highlights: [
      "Bài đánh giá thiên hướng nghề nghiệp & tính cách chuẩn hóa theo lứa tuổi",
      "Báo cáo R1: Bản đồ tiềm năng & Tổ hợp môn xét tuyển khuyến nghị",
      "01 phiên tham vấn 1-1 trực tiếp hoặc qua Zoom cùng Chuyên gia Hướng nghiệp",
    ],
  },
  {
    id: "pkg-tier2-screening",
    code: "PKG-TIER2-SCREENING",
    tierLabel: "Tầng 1 + 2 · Tầm Soát Toàn Diện 3 Mặt",
    title: "Gói Tầm Soát 3 Trụ Cột & Thiết Kế Lộ Trình Cá Nhân Hóa 60/40",
    subtitle: "Bao gồm trọn bộ Tầng 1 cộng thêm Tầm soát Kiến thức 5 môn, Sức khỏe Tinh thần, Thể chất và Phiên lập lộ trình cùng Cố vấn Cuộc sống.",
    listPriceVnd: 2_990_000,
    netPriceVnd: 2_490_000,
    discountTag: "Được chọn nhiều nhất",
    sessionsGranted: 2,
    sixMonthReferenceValueVnd: 2_490_000,
    highlights: [
      "Đầy đủ quyền lợi Gói Hướng nghiệp Tầng 1",
      "Truy vết lỗ hổng kiến thức gốc 5 môn chuẩn GDPT 2018 (Báo cáo R2)",
      "Đánh giá sức khỏe tinh thần, giấc ngủ, vận động & Thiết kế lộ trình 60/40 (Báo cáo R3 & R4)",
    ],
  },
  {
    id: "pkg-tier3-combo6m",
    code: "PKG-TIER3-COMBO6M",
    tierLabel: "Tầng 3 · Đồng Hành Chuyên Sâu 6 Tháng",
    title: "Gói Gia Sư Chuyên Gia 1 Kèm 1 & Cố Vấn Cuộc Sống (Kỳ 6 Tháng · 48 Buổi)",
    subtitle: "Lộ trình lấp lỗ hổng kiến thức gốc (60%) kết hợp bám sát điểm số trên lớp (40%). Linh hoạt đổi hình thức Online / Trung tâm / Tại nhà.",
    listPriceVnd: 15_030_000,
    netPriceVnd: 13_980_000,
    discountTag: "Đã giảm 7% kỳ 6 tháng",
    sessionsGranted: 48,
    sixMonthReferenceValueVnd: 13_980_000,
    highlights: [
      "Cộng ngay 48 buổi học vào Ví buổi học của con (2 buổi/tuần trong 6 tháng)",
      "Linh hoạt chuyển đổi Online Zoom, Tại Trung tâm hoặc Tại nhà theo từng buổi",
      "Bảo lãnh hoàn tiền 100% số buổi chưa học trong 14 ngày đầu nếu chưa phù hợp",
    ],
  },
  {
    id: "pkg-addon-12s",
    code: "PKG-ADDON-12S",
    tierLabel: "Gói Nạp Thêm Buổi Học Linh Hoạt",
    title: "Gói Bổ Trợ Chuyên Đề 12 Buổi Gia Sư 1 Kèm 1 (Tự Chọn Môn)",
    subtitle: "Dành cho học sinh cần tăng tốc lấp lỗ hổng gốc hoặc ôn thi học kỳ / chuyển cấp ở một môn học cụ thể (Toán, Lý, Hóa, Anh, Văn).",
    listPriceVnd: 3_840_000,
    netPriceVnd: 3_600_000,
    discountTag: "Nạp nhanh vào Ví buổi học",
    sessionsGranted: 12,
    sixMonthReferenceValueVnd: 7_200_000,
    highlights: [
      "Cộng ngay 12 buổi học vào Ví buổi học gia đình ngay khi thanh toán VietQR",
      "Biên bản buổi học điện tử gửi Phụ huynh sau mỗi buổi học",
      "Miễn phí truy cập Gia sư AI Gợi mở Socratic 24/7 không giới hạn",
    ],
  },
  {
    id: "pkg-group-16s",
    code: "PKG-GROUP-16S",
    tierLabel: "Lớp Nhóm Nhỏ Cùng Lỗ Hổng Kiến Thức",
    title: "Gói Lớp Nhóm Chuyên Đề 2–5 Học Sinh (16 Buổi · 2 Tháng)",
    subtitle: "Ghép nhóm các học sinh có cùng lỗ hổng kiến thức gốc để tăng tương tác, tiết kiệm 40% chi phí so với lớp 1 kèm 1.",
    listPriceVnd: 3_200_000,
    netPriceVnd: 2_880_000,
    discountTag: "Tiết kiệm 40%",
    sessionsGranted: 16,
    sixMonthReferenceValueVnd: 8_640_000,
    highlights: [
      "Cộng 16 buổi lớp nhóm nhỏ (2–5 học sinh cùng trình độ & lỗ hổng kiến thức)",
      "Cam kết đủ sĩ số tối thiểu mới khai giảng hoặc quy đổi sang buổi 1 kèm 1",
      "Báo cáo tiến độ lấp lỗ hổng kiến thức hàng tuần",
    ],
  },
  {
    id: "pkg-boarding-1m",
    code: "PKG-BOARDING-1M",
    tierLabel: "Dịch Vụ Nội Trú & Bán Trú An Toàn",
    title: "Gói Bán Trú & Tự Học Có Quản Sinh Giám Sát (01 Tháng · 24 Ngày)",
    subtitle: "Không gian nghỉ trưa, dinh dưỡng kiểm soát dị ứng, điểm danh QR 4 mốc/ngày và xác thực người đón an toàn tại cơ sở Buôn Ma Thuột.",
    listPriceVnd: 4_800_000,
    netPriceVnd: 4_500_000,
    discountTag: "Cơ sở Buôn Ma Thuột",
    sessionsGranted: 24,
    sixMonthReferenceValueVnd: 27_000_000,
    highlights: [
      "Bữa trưa & bữa xế dinh dưỡng kiểm soát chặt chẽ theo hồ sơ dị ứng của từng học sinh",
      "Điểm danh QR tự động báo tin cho Phụ huynh và kiểm soát danh sách người được phép đón",
      "Giờ tự học buổi chiều có Quản sinh và Trợ giảng hướng dẫn",
    ],
  },
];

export const INITIAL_ECOMMERCE_ORDERS: EcommerceOrderRecord[] = [
  {
    id: "ord-1001",
    orderCode: "ORD-2026-1089",
    parentName: "Chị Nguyễn Thị Lan",
    phone: "0905.***.*89",
    studentCode: "HS-2026-0089",
    studentName: "Nguyễn Minh Khôi",
    itemsSummary: "Gói Gia Sư Chuyên Gia 1 Kèm 1 & Cố Vấn Cuộc Sống (Kỳ 6 Tháng · 48 Buổi)",
    subtotalVnd: 13_980_000,
    voucherCode: "OYLG2026",
    voucherDiscountVnd: 500_000,
    netPaidVnd: 13_480_000,
    sixMonthReferenceVnd: 13_480_000,
    sessionsGranted: 48,
    sessionsConsumed: 36,
    refCode: "CTV-A102",
    channel: "WEBSITE_ECOM",
    paymentMethod: "VIETQR_PAYOS",
    status: "PAID",
    tier1RepCommissionVnd: 1_348_000,
    tier2LeaderCommissionVnd: 674_000,
    createdAt: "05/11/2026 09:15",
  },
  {
    id: "ord-1002",
    orderCode: "ORD-2026-1104",
    parentName: "Anh Trần Quốc Tuấn",
    phone: "0912.***.*45",
    studentCode: "HS-2026-0104",
    studentName: "Trần Bảo Ngọc",
    itemsSummary: "Gói Tầm Soát 3 Trụ Cột + Gói Bổ Trợ 12 Buổi Gia Sư 1 Kèm 1",
    subtotalVnd: 6_090_000,
    voucherDiscountVnd: 0,
    netPaidVnd: 6_090_000,
    sixMonthReferenceVnd: 9_690_000,
    sessionsGranted: 14,
    sessionsConsumed: 2,
    refCode: "CTV-A102",
    channel: "POS_COUNTER",
    paymentMethod: "VIETQR_PAYOS",
    status: "PAID",
    tier1RepCommissionVnd: 609_000,
    tier2LeaderCommissionVnd: 304_500,
    createdAt: "07/11/2026 15:40",
  },
];

export const INITIAL_EZY_PAGE_FRAGMENTS: EzyPageFragmentItem[] = [
  {
    pageName: "common",
    fragmentName: "main_header_announcement",
    titleVi: "Thanh thông báo đầu trang Website",
    contentVi:
      "Hệ sinh thái Hướng nghiệp, Cố vấn Cuộc sống & Đồng hành Học sinh Lớp 1–12 | Hotline Tư vấn: 1900 636 888",
    updatedAt: "08/11/2026 14:00",
  },
  {
    pageName: "home",
    fragmentName: "main_banner",
    titleVi: "Tiêu đề chính Trang chủ",
    contentVi:
      "Giúp con biết mình sẽ trở thành ai, lấp đúng lỗ hổng kiến thức gốc và có Cố vấn đồng hành toàn diện.",
    updatedAt: "08/11/2026 14:00",
  },
  {
    pageName: "home",
    fragmentName: "three_tier_ecosystem_intro",
    titleVi: "Mô tả Hệ sinh thái Giáo dục 3 Tầng",
    contentVi:
      "All Your Life (OYLG) đồng hành cùng gia đình qua 3 tầng chuyên sâu: Hướng nghiệp khám phá bản thân, Cố vấn cuộc sống tầm soát toàn diện (Kiến thức · Tinh thần · Thể chất) và Chuyên gia bộ môn kèm sát theo lộ trình cá nhân hóa.",
    updatedAt: "08/11/2026 14:00",
  },
  {
    pageName: "home",
    fragmentName: "b6_pricing_simulator_intro",
    titleVi: "Giới thiệu Chính sách Học phí & Cam kết",
    contentVi:
      "Học phí minh bạch, linh hoạt chuyển đổi hình thức từng buổi học (Online qua Zoom, Tại Trung tâm hoặc Gia sư tại nhà). Cam kết hoàn tiền 100% các buổi chưa học trong 14 ngày đầu nếu gia đình chưa hài lòng.",
    updatedAt: "08/11/2026 14:00",
  },
  {
    pageName: "footer",
    fragmentName: "company_intro",
    titleVi: "Giới thiệu Công ty ở Chân trang",
    contentVi:
      "Công ty TNHH All Your Life (OYLG) — Đơn vị tiên phong trong lĩnh vực Hướng nghiệp, Cố vấn Cuộc sống, Bổ trợ Kiến thức gốc và Dịch vụ Nội trú – Bán trú an toàn cho học sinh phổ thông từ Lớp 1 đến Lớp 12.",
    updatedAt: "08/11/2026 14:00",
  },
  {
    pageName: "footer",
    fragmentName: "contact_information",
    titleVi: "Thông tin Địa chỉ & Liên hệ",
    contentVi:
      "Trụ sở & Khu Nội trú Tiêu chuẩn: TP. Buôn Ma Thuột, Tỉnh Đắk Lắk | Điện thoại: 1900 636 888 | Email: cskh@allyourlife.vn",
    updatedAt: "08/11/2026 14:00",
  },
];

export const EZY_TEAM_MEMBERS: EzyTeamMemberProfile[] = [
  {
    slug: "co-van-tracie-anh",
    name: "Cố vấn Tracie Anh",
    roleTitle: "Chủ tịch Hội đồng Chuyên môn & Thẩm định Học liệu",
    ezyRole: "Hội đồng Chuyên môn",
    expertTier: "Chuyên gia Trưởng môn (Cấp 3)",
    subjects: [
      "Thẩm định Chương trình & Ngân hàng Đánh giá Năng lực",
      "Phê duyệt Báo cáo Hướng nghiệp & Lộ trình Cá nhân hóa",
      "Giám sát Chuẩn mực An toàn Tâm lý Học đường",
    ],
    modes: ["Online qua Zoom", "Tại Trung tâm Buôn Ma Thuột"],
    rating: 5.0,
    studentsCount: 320,
    achievementSummary: "Trực tiếp kiểm duyệt 100% báo cáo chuyên môn và học liệu trước khi gửi tới Phụ huynh",
    bio: "Chuyên gia trưởng phụ trách kiểm định chất lượng học liệu, bộ câu hỏi tầm soát năng lực và các báo cáo định hướng cho học sinh trên toàn hệ thống All Your Life (OYLG).",
    education: [
      "Chủ tịch Hội đồng Thẩm định Học liệu & Định hướng Giáo dục OYLG",
      "Chuyên gia Tư vấn Hướng nghiệp & Đồng hành Tâm lý Thanh thiếu niên",
    ],
    avatarBg: "bg-purple-700",
    initials: "TA",
  },
  {
    slug: "ths-le-minh-tam",
    name: "ThS. Lê Minh Tâm",
    roleTitle: "Cố vấn Cuộc sống & Chuyên gia Hướng nghiệp",
    ezyRole: "Cố vấn Cuộc sống",
    expertTier: "Chuyên gia Trưởng môn (Cấp 3)",
    subjects: [
      "Hướng nghiệp Chuyên sâu (RIASEC & Big Five)",
      "Tầm soát Toàn diện 3 Mặt (Kiến thức · Tinh thần · Thể chất)",
      "Thiết kế Lộ trình Học tập Cá nhân hóa 60/40",
    ],
    modes: ["Online qua Zoom", "Tại Trung tâm Buôn Ma Thuột"],
    rating: 4.98,
    studentsCount: 84,
    achievementSummary: "94% học sinh xác định rõ mục tiêu trường/ngành và lấy lại động lực học tập tự giác",
    bio: "Đồng hành trực tiếp cùng Phụ huynh và Học sinh trong việc giải mã thế mạnh bản thân, tháo gỡ áp lực tâm lý tuổi dậy thì và điều phối đội ngũ giáo viên bộ môn.",
    education: [
      "Thạc sĩ Tâm lý & Giáo dục học",
      "Chứng nhận Chuyên gia Tư vấn Hướng nghiệp Quốc tế",
    ],
    avatarBg: "bg-emerald-700",
    initials: "MT",
  },
  {
    slug: "thay-dang-quoc-viet",
    name: "Thầy Đặng Quốc Việt",
    roleTitle: "Trưởng Bộ môn Toán THCS & THPT",
    ezyRole: "Trưởng môn Toán",
    expertTier: "Chuyên gia Trưởng môn (Cấp 3)",
    subjects: [
      "Lấy lại gốc Toán từ Lớp 1 đến Lớp 12 (Chương trình GDPT 2018)",
      "Bồi dưỡng Toán Lớp 6–9 & Ôn thi vào Lớp 10 Chuyên",
      "Luyện thi Tốt nghiệp THPT & Đánh giá Năng lực",
    ],
    modes: ["Online qua Zoom", "Tại Trung tâm Buôn Ma Thuột", "Tại nhà Học sinh"],
    rating: 4.96,
    studentsCount: 112,
    achievementSummary: "Giúp học sinh tăng trung bình +2.4 điểm Toán sau 8 tuần bù lấp đúng lỗ hổng gốc",
    bio: "Trưởng bộ môn Toán tại OYLG, người trực tiếp xây dựng bản đồ truy vết lỗ hổng kiến thức Toán học giúp học sinh mất gốc lấy lại nền tảng vững chắc mà không cần học nhồi nhét.",
    education: [
      "Cử nhân Sư phạm Toán học loại Giỏi",
      "12 năm kinh nghiệm bồi dưỡng học sinh giỏi & kèm học sinh mất gốc",
    ],
    avatarBg: "bg-indigo-700",
    initials: "QV",
  },
  {
    slug: "co-le-bao-tram",
    name: "Cô Lê Bảo Trâm",
    roleTitle: "Trưởng Bộ môn Tiếng Anh & Ngữ Văn",
    ezyRole: "Trưởng môn Ngôn ngữ",
    expertTier: "Chuyên gia Cao cấp (Cấp 2)",
    subjects: [
      "Tiếng Anh Hệ thống Lớp 1–12 & Giao tiếp Học thuật",
      "Ngữ pháp Cốt lõi & Luyện thi Chuyển cấp / IELTS nền tảng",
      "Đọc hiểu & Kỹ năng Viết Nghị luận Ngữ Văn GDPT 2018",
    ],
    modes: ["Online qua Zoom", "Tại Trung tâm Buôn Ma Thuột"],
    rating: 4.94,
    studentsCount: 95,
    achievementSummary: "91% học sinh vượt mục tiêu điểm số trên trường sau 6 tuần đồng hành",
    bio: "Chuyên gia phụ trách tầm soát và phát triển năng lực Ngôn ngữ (Tiếng Anh & Ngữ Văn), giúp học sinh yêu thích việc đọc hiểu và diễn đạt tư duy mạch lạc.",
    education: [
      "Thạc sĩ Lý luận & Phương pháp Giảng dạy Tiếng Anh (TESOL)",
      "Chứng chỉ Quốc tế IELTS 8.0",
    ],
    avatarBg: "bg-sky-700",
    initials: "BT",
  },
];

export interface ScheduledBookingItem {
  id: string;
  studentCode: string;
  studentName: string;
  subject: string;
  title: string;
  expertName: string;
  expertTier: ExpertTier;
  dateLabel: string;
  timeRange: string;
  mode: DeliveryMode;
  classType: ClassType;
  zoomUrl?: string;
  locationText?: string;
  status: "CONFIRMED" | "COMPLETED" | "RESCHEDULED";
  noteSubmitted: boolean;
  unitCode: string;
}

export interface LeadIntakeRecord {
  id: string;
  parentName: string;
  phone: string;
  studentName: string;
  grade: number;
  province: string;
  serviceInterest: string;
  refCode?: string;
  channel: "ONLINE" | "OFFICE" | "EVENT";
  stage: "NEW" | "QUALIFIED" | "SCHEDULED" | "PAID";
  assignedExpert?: string;
  amountVnd: number;
  createdAt: string;
}

export interface LessonLogEntry {
  id: string;
  bookingId: string;
  studentName: string;
  subject: string;
  unitCode: string;
  masteryLevel: "CHƯA HIỂU" | "HIỂU MỘT PHẦN" | "NẮM VỮNG";
  mood: string;
  focusScore: number;
  sanitizedNoteToParent: string;
  internalNoteToCoach: string;
  safetyLevel: "NONE" | "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
}

export interface BoardingLogEntry {
  id: string;
  studentCode: string;
  studentName: string;
  time: string;
  type: "ARRIVE" | "LEAVE" | "MEAL" | "NIGHT" | "SECURITY_ALERT";
  detail: string;
  status: "OK" | "BLOCKED";
}

interface PlatformContextValue {
  isLoggedIn: boolean;
  loginAsPersona: (id: ActivePersonaId) => void;
  logout: () => void;
  currentPersona: PersonaAccount;
  setPersonaById: (id: ActivePersonaId) => void;
  studentCases: StudentCaseProfile[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  bookings: ScheduledBookingItem[];
  updateBookingMode: (bookingId: string, newMode: DeliveryMode) => void;
  rescheduleBooking: (bookingId: string, newDateLabel: string, newTimeRange: string) => void;
  leads: LeadIntakeRecord[];
  addLeadAndOrder: (lead: Omit<LeadIntakeRecord, "id" | "createdAt">) => LeadIntakeRecord;
  advanceLeadStage: (leadId: string, nextStage: LeadIntakeRecord["stage"], expertName?: string) => void;
  questions: ReviewableQuestionItem[];
  decideQuestionApproval: (id: string, status: "APPROVED" | "RETURNED") => void;
  addAiGeneratedQuestion: (q: Omit<ReviewableQuestionItem, "id">) => void;
  classGroups: WaitingClassGroup[];
  enrollInClassGroup: (groupId: string) => void;
  launchClassGroup: (groupId: string) => void;
  lessonLogs: LessonLogEntry[];
  submitLessonLog: (entry: Omit<LessonLogEntry, "id" | "createdAt">) => void;
  boardingLogs: BoardingLogEntry[];
  addBoardingLog: (entry: Omit<BoardingLogEntry, "id">) => void;
  playbooks: RagPlaybookRecommendation[];
  applyPlaybook: (id: string) => void;
  baseSessionPriceVnd: number;
  setBaseSessionPriceVnd: (price: number) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  ezyPageFragments: EzyPageFragmentItem[];
  updateEzyPageFragment: (pageName: string, fragmentName: string, newContent: string) => void;
  ezyTeamMembers: EzyTeamMemberProfile[];
  isEzyLoginModalOpen: boolean;
  setIsEzyLoginModalOpen: (open: boolean) => void;
  // Unified E-Commerce (`ecommerce` + `ezypayment` + OYLG Wallet)
  ecomProducts: EcommerceProductItem[];
  cartItems: EcommerceCartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: EcommerceProductItem, customNote?: string, openDrawer?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  orders: EcommerceOrderRecord[];
  ecomOrders: EcommerceOrderRecord[];
  checkoutCartWithVietQr: (params: {
    parentName: string;
    phone: string;
    studentName: string;
    grade: number;
    refCode?: string;
    channel?: EcommerceOrderRecord["channel"];
    overridePackage?: {
      title: string;
      amountVnd: number;
      sessionsGranted?: number;
    };
  }) => EcommerceOrderRecord;
  requestOrderRefund14d: (orderId: string) => {
    refundAmountVnd: number;
    unusedSessions: number;
  } | null;
}

const INITIAL_BOOKINGS: ScheduledBookingItem[] = [
  {
    id: "bk-101",
    studentCode: "HS-2026-0089",
    studentName: "Nguyễn Minh Khôi",
    subject: "Toán Lớp 9",
    title: "Bổ trợ Hằng đẳng thức & Rút gọn căn thức bậc hai",
    expertName: "Thầy Đặng Quốc Việt",
    expertTier: 3,
    dateLabel: "Thứ Năm, 12/11/2026",
    timeRange: "19:30 – 21:00",
    mode: "AT_CENTER",
    classType: "ONE_ON_ONE",
    locationText: "Phòng P204 – Trung tâm OYLG Buôn Ma Thuột",
    status: "CONFIRMED",
    noteSubmitted: false,
    unitCode: "TOAN.08.HDT.01",
  },
  {
    id: "bk-102",
    studentCode: "HS-2026-0089",
    studentName: "Nguyễn Minh Khôi",
    subject: "Cố vấn Cuộc sống",
    title: "Phiên Rà soát Lộ trình tháng 11 & Cân bằng nhịp sinh hoạt",
    expertName: "ThS. Lê Minh Tâm",
    expertTier: 3,
    dateLabel: "Thứ Bảy, 14/11/2026",
    timeRange: "09:00 – 10:00",
    mode: "ONLINE_ZOOM",
    classType: "ONE_ON_ONE",
    zoomUrl: "https://zoom.us/j/9823412009 (Pass: OYLG2026)",
    status: "CONFIRMED",
    noteSubmitted: false,
    unitCode: "ROADMAP.CHECKPOINT.02",
  },
  {
    id: "bk-103",
    studentCode: "HS-2026-0104",
    studentName: "Trần Bảo Ngọc",
    subject: "Toán Lớp 11",
    title: "Phương trình lượng giác cơ bản & Giảm tải bài tập",
    expertName: "Thầy Đặng Quốc Việt",
    expertTier: 3,
    dateLabel: "Thứ Sáu, 13/11/2026",
    timeRange: "18:00 – 19:30",
    mode: "ONLINE_ZOOM",
    classType: "ONE_ON_ONE",
    zoomUrl: "https://zoom.us/j/9823415512 (Pass: OYLG2026)",
    status: "CONFIRMED",
    noteSubmitted: false,
    unitCode: "TOAN.11.LG.01",
  },
  {
    id: "bk-104",
    studentCode: "HS-2026-0118",
    studentName: "Lê Hoàng Gia Bảo",
    subject: "Tiếng Anh & Toán Tư Duy Lớp 4",
    title: "Phản xạ giao tiếp chủ đề Khoa học & Giải toán có lời văn",
    expertName: "Cô Lê Bảo Trâm",
    expertTier: 2,
    dateLabel: "Chủ Nhật, 15/11/2026",
    timeRange: "09:30 – 11:00",
    mode: "AT_CENTER",
    classType: "ONE_ON_ONE",
    locationText: "Phòng P102 – Trung tâm OYLG Buôn Ma Thuột",
    status: "CONFIRMED",
    noteSubmitted: false,
    unitCode: "ENG.04.SPK.02",
  },
];

const INITIAL_LEADS: LeadIntakeRecord[] = [
  {
    id: "ld-01",
    parentName: "Chị Nguyễn Thị Lan",
    phone: "0905.***.*89",
    studentName: "Nguyễn Minh Khôi",
    grade: 9,
    province: "Đắk Lắk",
    serviceInterest: "Combo Hướng nghiệp + Tầm soát 3 mặt + Toán Lớp 9",
    refCode: "CTV-A102",
    channel: "ONLINE",
    stage: "PAID",
    assignedExpert: "ThS. Lê Minh Tâm",
    amountVnd: 13_480_000,
    createdAt: "05/11/2026",
  },
  {
    id: "ld-02",
    parentName: "Anh Hoàng Văn Đức",
    phone: "0918.***.*34",
    studentName: "Hoàng Gia Hân",
    grade: 8,
    province: "Đắk Lắk",
    serviceInterest: "Phiên Hướng nghiệp + Tầm soát Toán – Anh – Văn",
    refCode: "CTV-A102",
    channel: "EVENT",
    stage: "QUALIFIED",
    amountVnd: 4_500_000,
    createdAt: "07/11/2026",
  },
  {
    id: "ld-03",
    parentName: "Chị Lê Thu Trang",
    phone: "0982.***.*61",
    studentName: "Phạm Minh Quân",
    grade: 10,
    province: "Gia Lai",
    serviceInterest: "Tầm soát lỗ hổng Toán – Lý – Hóa khối A00",
    channel: "ONLINE",
    stage: "NEW",
    amountVnd: 3_200_000,
    createdAt: "08/11/2026",
  },
];

const INITIAL_LESSON_LOGS: LessonLogEntry[] = [
  {
    id: "ll-01",
    bookingId: "bk-099",
    studentName: "Nguyễn Minh Khôi",
    subject: "Toán Lớp 9",
    unitCode: "TOAN.08.HDT.01",
    masteryLevel: "NẮM VỮNG",
    mood: "Tập trung cao",
    focusScore: 5,
    sanitizedNoteToParent:
      "Con đã nắm vững 3 hằng đẳng thức đầu tiên và vận dụng tốt vào bài rút gọn căn thức lớp 9. Về nhà con hoàn thành 4 bài tự luyện trang 18 nhé.",
    internalNoteToCoach:
      "Khôi tiếp thu nhanh khi vẽ sơ đồ hình học minh họa hằng đẳng thức. Đề xuất tuần sau chuyển sang TOAN.08.PTB1.03.",
    safetyLevel: "NONE",
    createdAt: "06/11/2026 21:05",
  },
  {
    id: "ll-02",
    bookingId: "bk-098",
    studentName: "Trần Bảo Ngọc",
    subject: "Hóa Lớp 11",
    unitCode: "HOA.11.CBHH.02",
    masteryLevel: "HIỂU MỘT PHẦN",
    mood: "Căng thẳng",
    focusScore: 3,
    sanitizedNoteToParent:
      "Hôm nay con hơi mệt do lịch học trên trường dày, thầy đã giảm 50% lượng bài tập về nhà để con nghỉ ngơi sớm.",
    internalNoteToCoach:
      "Buổi thứ 3 liên tiếp Bảo Ngọc có dấu hiệu mệt mỏi, thiếu ngủ. Cố vấn cần trao đổi giảm tải ngay.",
    safetyLevel: "LOW",
    createdAt: "06/11/2026 19:40",
  },
  {
    id: "ll-03",
    bookingId: "bk-097",
    studentName: "Lê Hoàng Gia Bảo",
    subject: "Tiếng Anh Lớp 4",
    unitCode: "ENG.04.SPK.02",
    masteryLevel: "NẮM VỮNG",
    mood: "Hào hứng",
    focusScore: 5,
    sanitizedNoteToParent:
      "Gia Bảo rất hào hứng thuyết trình bằng Tiếng Anh về hệ Mặt Trời và hoàn thành xuất sắc 5 bài toán đố tư duy.",
    internalNoteToCoach:
      "Con có năng khiếu ngôn ngữ và tư duy hình ảnh rất tốt, tuần tới có thể nâng cấp độ đọc hiểu Khoa học.",
    safetyLevel: "NONE",
    createdAt: "05/11/2026 17:30",
  },
];

const INITIAL_BOARDING_LOGS: BoardingLogEntry[] = [
  {
    id: "bl-01",
    studentCode: "HS-2026-0089",
    studentName: "Nguyễn Minh Khôi",
    time: "11:40",
    type: "ARRIVE",
    detail: "Quét QR thẻ học sinh đến khu Bán trú · Đã gửi thông báo tự động cho mẹ (Chị Lan)",
    status: "OK",
  },
  {
    id: "bl-02",
    studentCode: "HS-2026-0089",
    studentName: "Nguyễn Minh Khôi",
    time: "12:10",
    type: "MEAL",
    detail: "Ăn trưa thực đơn tiêu chuẩn (Đã tách riêng món tôm/cua biển theo cảnh báo dị ứng)",
    status: "OK",
  },
  {
    id: "bl-03",
    studentCode: "HS-2026-0104",
    studentName: "Trần Bảo Ngọc",
    time: "22:30",
    type: "NIGHT",
    detail: "Điểm danh tối Phòng Nội trú Nữ N302 · Nhắc nhở tắt đèn nghỉ ngơi sớm",
    status: "OK",
  },
];

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [personaId, setPersonaId] = useState<ActivePersonaId>("PARENT_LAN");
  const [studentCases, setStudentCases] =
    useState<StudentCaseProfile[]>(STUDENT_CASES);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    STUDENT_CASES[0].id
  );
  const [bookings, setBookings] =
    useState<ScheduledBookingItem[]>(INITIAL_BOOKINGS);
  const [leads, setLeads] = useState<LeadIntakeRecord[]>(INITIAL_LEADS);
  const [questions, setQuestions] = useState<ReviewableQuestionItem[]>(
    APPROVAL_QUEUE_ITEMS
  );
  const [classGroups, setClassGroups] =
    useState<WaitingClassGroup[]>(WAITING_CLASS_GROUPS);
  const [lessonLogs, setLessonLogs] =
    useState<LessonLogEntry[]>(INITIAL_LESSON_LOGS);
  const [boardingLogs, setBoardingLogs] =
    useState<BoardingLogEntry[]>(INITIAL_BOARDING_LOGS);
  const [playbooks, setPlaybooks] = useState<RagPlaybookRecommendation[]>(
    RAG_PLAYBOOK_RECOMMENDATIONS
  );
  const [baseSessionPriceVnd, setBaseSessionPriceVnd] =
    useState<number>(200_000);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [ezyPageFragments, setEzyPageFragments] = useState<EzyPageFragmentItem[]>(
    INITIAL_EZY_PAGE_FRAGMENTS
  );
  const [isEzyLoginModalOpen, setIsEzyLoginModalOpen] = useState<boolean>(false);

  // Unified E-Commerce State
  const [ecomProducts] = useState<EcommerceProductItem[]>(
    INITIAL_ECOMMERCE_PRODUCTS
  );
  const [cartItems, setCartItems] = useState<EcommerceCartItem[]>([
    {
      product: INITIAL_ECOMMERCE_PRODUCTS[1], // Tầng 1 + 2 mặc định sẵn sàng trong giỏ để trải nghiệm nhanh
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [voucherCode, setVoucherCode] = useState<string>("OYLG2026");
  const [orders, setOrders] = useState<EcommerceOrderRecord[]>(
    INITIAL_ECOMMERCE_ORDERS
  );

  const currentPersona =
    PERSONA_ACCOUNTS.find((p) => p.id === personaId) ?? PERSONA_ACCOUNTS[0];

  const loginAsPersona = (id: ActivePersonaId) => {
    setPersonaId(id);
    setIsLoggedIn(true);
    setIsEzyLoginModalOpen(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const setPersonaById = (id: ActivePersonaId) => {
    setPersonaId(id);
    setIsLoggedIn(true);
  };

  const addToCart = (
    product: EcommerceProductItem,
    customNote?: string,
    openDrawer = true
  ) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                customNote: customNote ?? item.customNote,
              }
            : item
        );
      }
      return [...prev, { product, quantity: 1, customNote }];
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const checkoutCartWithVietQr = (params: {
    parentName: string;
    phone: string;
    studentName: string;
    grade: number;
    refCode?: string;
    channel?: EcommerceOrderRecord["channel"];
    overridePackage?: {
      title: string;
      amountVnd: number;
      sessionsGranted?: number;
    };
  }): EcommerceOrderRecord => {
    const subtotalVnd = params.overridePackage
      ? params.overridePackage.amountVnd
      : cartItems.reduce(
          (sum, item) => sum + item.product.netPriceVnd * item.quantity,
          0
        );
    const sixMonthRefVnd = params.overridePackage
      ? params.overridePackage.amountVnd
      : cartItems.reduce(
          (sum, item) =>
            sum + item.product.sixMonthReferenceValueVnd * item.quantity,
          0
        );
    const totalSessionsGranted = params.overridePackage
      ? params.overridePackage.sessionsGranted ??
        (params.overridePackage.amountVnd >= 10_000_000
          ? 48
          : params.overridePackage.amountVnd >= 4_000_000
          ? 12
          : 4)
      : cartItems.reduce(
          (sum, item) => sum + item.product.sessionsGranted * item.quantity,
          0
        );
    const normalizedVoucher = voucherCode.trim().toUpperCase();
    const voucherDiscountVnd = params.overridePackage
      ? 0
      : normalizedVoucher === "OYLG2026"
      ? Math.min(500_000, subtotalVnd)
      : normalizedVoucher === "BMT10"
      ? Math.min(1_000_000, Math.round(subtotalVnd * 0.1))
      : 0;
    const netPaidVnd = Math.max(0, subtotalVnd - voucherDiscountVnd);

    const commissionPlan = calculateOrderCommissionPlan({
      orderCode: "TEMP-CALC",
      packageBillingModel: "ONE_TIME",
      firstPaymentVnd: Math.max(netPaidVnd, sixMonthRefVnd),
      orderKind: "NEW",
      sellerRole: "SALES_AGENT",
      advisedByRole: "SALES_AGENT",
      isSelfPurchase: false,
      collectedInstallmentsVnd: [netPaidVnd],
    });

    const selectedStudent =
      studentCases.find((s) => s.id === selectedStudentId) ?? studentCases[0];

    const itemsSummary = params.overridePackage
      ? params.overridePackage.title
      : cartItems
          .map((c) =>
            c.quantity > 1
              ? `${c.product.title} (x${c.quantity})`
              : c.product.title
          )
          .join(" + ") || "Gói dịch vụ OYLG";

    const newOrder: EcommerceOrderRecord = {
      id: `ord-${Date.now()}`,
      orderCode: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      parentName: params.parentName || selectedStudent.parentName,
      phone: params.phone || "0905.***.*89",
      studentCode: selectedStudent.code,
      studentName: params.studentName || selectedStudent.fullName,
      itemsSummary,
      subtotalVnd,
      voucherCode: voucherDiscountVnd > 0 ? normalizedVoucher : undefined,
      voucherDiscountVnd,
      netPaidVnd,
      sixMonthReferenceVnd: Math.max(netPaidVnd, sixMonthRefVnd),
      sessionsGranted: totalSessionsGranted,
      sessionsConsumed: 0,
      refCode: params.refCode || "CTV-A102",
      channel: params.channel ?? "WEBSITE_ECOM",
      paymentMethod: "VIETQR_PAYOS",
      status: "PAID",
      tier1RepCommissionVnd: commissionPlan.totalDisbursedCtvVnd,
      tier2LeaderCommissionVnd: commissionPlan.totalDisbursedLeaderVnd,
      createdAt: new Date().toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Tự động cộng số buổi học vào Ví buổi học của học sinh
    if (totalSessionsGranted > 0) {
      setStudentCases((prev) =>
        prev.map((sc) =>
          sc.id === selectedStudent.id
            ? {
                ...sc,
                sessionCreditsRemaining:
                  sc.sessionCreditsRemaining + totalSessionsGranted,
              }
            : sc
        )
      );
    }

    // Tự động ghi nhận vào danh sách khách hàng đã thanh toán
    addLeadAndOrder({
      parentName: newOrder.parentName,
      phone: newOrder.phone,
      studentName: newOrder.studentName,
      grade: params.grade || selectedStudent.grade,
      province: "Đắk Lắk",
      serviceInterest: itemsSummary,
      refCode: newOrder.refCode,
      channel: newOrder.channel === "POS_COUNTER" ? "OFFICE" : "ONLINE",
      stage: "PAID",
      assignedExpert: "ThS. Lê Minh Tâm",
      amountVnd: netPaidVnd,
    });

    if (!params.overridePackage) {
      setCartItems([]);
    }
    return newOrder;
  };

  const requestOrderRefund14d = (orderIdOrCode: string) => {
    const targetOrder = orders.find(
      (o) => o.id === orderIdOrCode || o.orderCode === orderIdOrCode
    );
    if (!targetOrder || targetOrder.status === "REFUNDED_14D") return null;

    const unusedSessions = Math.max(
      0,
      targetOrder.sessionsGranted - targetOrder.sessionsConsumed
    );
    const refundAmountVnd =
      targetOrder.sessionsGranted > 0
        ? Math.round(
            (targetOrder.netPaidVnd * unusedSessions) /
              targetOrder.sessionsGranted
          )
        : targetOrder.netPaidVnd;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === targetOrder.id
          ? {
              ...o,
              status: "REFUNDED_14D",
              refundAmountVnd,
              tier1RepCommissionVnd: 0,
              tier2LeaderCommissionVnd: 0,
            }
          : o
      )
    );

    if (unusedSessions > 0) {
      setStudentCases((prev) =>
        prev.map((sc) =>
          sc.code === targetOrder.studentCode
            ? {
                ...sc,
                sessionCreditsRemaining: Math.max(
                  0,
                  sc.sessionCreditsRemaining - unusedSessions
                ),
              }
            : sc
        )
      );
    }

    return {
      refundAmountVnd,
      unusedSessions,
    };
  };

  const updateEzyPageFragment = (
    pageName: string,
    fragmentName: string,
    newContent: string
  ) => {
    setEzyPageFragments((prev) =>
      prev.map((frag) =>
        frag.pageName === pageName && frag.fragmentName === fragmentName
          ? {
              ...frag,
              contentVi: newContent,
              updatedAt: new Date().toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
            }
          : frag
      )
    );
  };

  const updateBookingMode = (bookingId: string, newMode: DeliveryMode) => {
    setBookings((prev) =>
      prev.map((bk) => {
        if (bk.id !== bookingId) return bk;
        return {
          ...bk,
          mode: newMode,
          zoomUrl:
            newMode === "ONLINE_ZOOM"
              ? "https://zoom.us/j/9823499110 (Tự động tạo qua hệ thống OYLG)"
              : undefined,
          locationText:
            newMode === "AT_CENTER"
              ? "Phòng P204 – Trung tâm OYLG Buôn Ma Thuột"
              : newMode === "AT_HOME"
              ? "Tại nhà học sinh (Chỉ hiển thị địa chỉ cho Giáo viên phụ trách)"
              : undefined,
        };
      })
    );
  };

  const rescheduleBooking = (
    bookingId: string,
    newDateLabel: string,
    newTimeRange: string
  ) => {
    setBookings((prev) =>
      prev.map((bk) =>
        bk.id === bookingId
          ? {
              ...bk,
              dateLabel: newDateLabel,
              timeRange: newTimeRange,
              status: "RESCHEDULED",
            }
          : bk
      )
    );
  };

  const addLeadAndOrder = (
    lead: Omit<LeadIntakeRecord, "id" | "createdAt">
  ): LeadIntakeRecord => {
    const newRecord: LeadIntakeRecord = {
      ...lead,
      id: `ld-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };
    setLeads((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const advanceLeadStage = (
    leadId: string,
    nextStage: LeadIntakeRecord["stage"],
    expertName?: string
  ) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              stage: nextStage,
              assignedExpert: expertName ?? l.assignedExpert,
            }
          : l
      )
    );
  };

  const decideQuestionApproval = (
    id: string,
    status: "APPROVED" | "RETURNED"
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, finalApprovalStatus: status } : q
      )
    );
  };

  const addAiGeneratedQuestion = (q: Omit<ReviewableQuestionItem, "id">) => {
    setQuestions((prev) => [{ ...q, id: `q-${Date.now()}` }, ...prev]);
  };

  const enrollInClassGroup = (groupId: string) => {
    setClassGroups((prev) =>
      prev.map((cg) => {
        if (cg.id !== groupId) return cg;
        const nextCount = Math.min(cg.maxSize, cg.enrolledCount + 1);
        return {
          ...cg,
          enrolledCount: nextCount,
          status:
            nextCount >= cg.minSize && cg.status === "WAITING_MIN_SIZE"
              ? "READY_TO_LAUNCH"
              : cg.status,
        };
      })
    );
  };

  const launchClassGroup = (groupId: string) => {
    setClassGroups((prev) =>
      prev.map((cg) =>
        cg.id === groupId ? { ...cg, status: "LAUNCHED" } : cg
      )
    );
  };

  const submitLessonLog = (
    entry: Omit<LessonLogEntry, "id" | "createdAt">
  ) => {
    const created: LessonLogEntry = {
      ...entry,
      id: `ll-${Date.now()}`,
      createdAt: new Date().toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
    setLessonLogs((prev) => [created, ...prev]);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === entry.bookingId
          ? { ...b, status: "COMPLETED", noteSubmitted: true }
          : b
      )
    );
  };

  const addBoardingLog = (entry: Omit<BoardingLogEntry, "id">) => {
    setBoardingLogs((prev) => [
      { ...entry, id: `bl-${Date.now()}` },
      ...prev,
    ]);
  };

  const applyPlaybook = (id: string) => {
    setPlaybooks((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "APPLIED" } : p))
    );
  };

  return (
    <PlatformContext.Provider
      value={{
        isLoggedIn,
        loginAsPersona,
        logout,
        currentPersona,
        setPersonaById,
        studentCases,
        selectedStudentId,
        setSelectedStudentId,
        bookings,
        updateBookingMode,
        rescheduleBooking,
        leads,
        addLeadAndOrder,
        advanceLeadStage,
        questions,
        decideQuestionApproval,
        addAiGeneratedQuestion,
        classGroups,
        enrollInClassGroup,
        launchClassGroup,
        lessonLogs,
        submitLessonLog,
        boardingLogs,
        addBoardingLog,
        playbooks,
        applyPlaybook,
        baseSessionPriceVnd,
        setBaseSessionPriceVnd,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        ezyPageFragments,
        updateEzyPageFragment,
        ezyTeamMembers: EZY_TEAM_MEMBERS,
        isEzyLoginModalOpen,
        setIsEzyLoginModalOpen,
        ecomProducts: INITIAL_ECOMMERCE_PRODUCTS,
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        voucherCode,
        setVoucherCode,
        orders,
        ecomOrders: orders,
        checkoutCartWithVietQr,
        requestOrderRefund14d,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return ctx;
}
