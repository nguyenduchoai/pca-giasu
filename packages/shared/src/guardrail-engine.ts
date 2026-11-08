// ============================================================================
// 4 NON-NEGOTIABLE GUARDRAIL ENGINES (M01.4, M14, M19.1, M20.12)
// 1. Chống lộ SĐT/Zalo/MXH (DLP Contact Masking)
// 2. Cảnh báo an toàn tâm lý vị thành niên (M14 – Hotline 111/115)
// 3. Chống làm phiền phụ huynh (1 tin tổng hợp/ngày + bản tin tuần)
// 4. Ẩn danh dữ liệu trẻ em trước khi gọi AI quốc tế (NĐ 13/2023)
// ============================================================================

import { RoleCode, SafetyLevel } from "./types";

export interface ContactMaskingResult {
  originalText: string;
  sanitizedText: string;
  hasViolation: boolean;
  detectedItems: Array<{
    type: "PHONE" | "OBFUSCATED_PHONE" | "ZALO_SOCIAL" | "EMAIL";
    matched: string;
  }>;
}

const VIET_NUMBER_WORDS: Record<string, string> = {
  không: "0",
  khong: "0",
  ko: "0",
  một: "1",
  mot: "1",
  hai: "2",
  ba: "3",
  bốn: "4",
  bon: "4",
  tư: "4",
  năm: "5",
  nam: "5",
  lăm: "5",
  sáu: "6",
  sau: "6",
  bảy: "7",
  bay: "7",
  tám: "8",
  tam: "8",
  chín: "9",
  chin: "9",
};

/**
 * RÀO CHẮN #1 (Mục 1.4-6): Không để gia sư/chuyên gia liên hệ riêng với phụ huynh.
 * Tự động phát hiện và che số điện thoại (kể cả viết cách, dấu chấm hoặc viết bằng chữ tiếng Việt),
 * link Zalo, Facebook, Telegram, Email trong tin nhắn, biên bản, ghi chú.
 */
export function maskContactInfo(text: string): ContactMaskingResult {
  const detectedItems: ContactMaskingResult["detectedItems"] = [];
  let sanitizedText = text;

  // 1. Phát hiện Email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  sanitizedText = sanitizedText.replace(emailRegex, (match) => {
    detectedItems.push({ type: "EMAIL", matched: match });
    return "[ĐÃ CHE EMAIL THEO QUY ĐỊNH OYLG]";
  });

  // 2. Phát hiện link mạng xã hội / Zalo / Facebook / Telegram
  const socialRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:zalo\.me|facebook\.com|fb\.com|m\.me|t\.me)\/[^\s,]+|(?:zalo|fb|facebook|liên hệ riêng|nhắn riêng)\s*[:=-]?\s*@?[a-zA-Z0-9._]{4,}/gi;
  sanitizedText = sanitizedText.replace(socialRegex, (match) => {
    detectedItems.push({ type: "ZALO_SOCIAL", matched: match });
    return "[ĐÃ CHE LIÊN KẾT CÁ NHÂN THEO QUY ĐỊNH OYLG]";
  });

  // 3. Phát hiện số điện thoại Việt Nam (03, 05, 07, 08, 09 hoặc +84, có thể xen dấu chấm/gạch/khoảng trắng)
  const phoneRegex =
    /(?:\+?84|0)(?:[\s.-]*\d){8,9}\b/g;
  sanitizedText = sanitizedText.replace(phoneRegex, (match) => {
    detectedItems.push({ type: "PHONE", matched: match });
    return "[ĐÃ CHE SĐT CÁ NHÂN – TRAO ĐỔI QUA NỀN TẢNG OYLG]";
  });

  // 4. Phát hiện số điện thoại cố tình viết chữ trộn số (VD: "09 tám bảy 654 321")
  const tokens = sanitizedText.split(/(\s+)/);
  let digitRun = "";
  let tokenStartIdx = -1;

  for (let i = 0; i < tokens.length; i++) {
    const clean = tokens[i].toLowerCase().replace(/[.,-]/g, "");
    if (/^\d+$/.test(clean)) {
      if (tokenStartIdx === -1) tokenStartIdx = i;
      digitRun += clean;
    } else if (VIET_NUMBER_WORDS[clean] !== undefined) {
      if (tokenStartIdx === -1) tokenStartIdx = i;
      digitRun += VIET_NUMBER_WORDS[clean];
    } else if (/^\s+$/.test(tokens[i])) {
      continue;
    } else {
      if (digitRun.length >= 9 && digitRun.length <= 11) {
        const matchedPhrase = tokens.slice(tokenStartIdx, i).join("");
        detectedItems.push({
          type: "OBFUSCATED_PHONE",
          matched: matchedPhrase.trim(),
        });
        for (let k = tokenStartIdx; k < i; k++) tokens[k] = "";
        tokens[tokenStartIdx] = "[ĐÃ CHE SĐT VIẾT CHỮ THEO QUY ĐỊNH OYLG]";
      }
      digitRun = "";
      tokenStartIdx = -1;
    }
  }
  if (digitRun.length >= 9 && digitRun.length <= 11 && tokenStartIdx !== -1) {
    const matchedPhrase = tokens.slice(tokenStartIdx).join("");
    detectedItems.push({
      type: "OBFUSCATED_PHONE",
      matched: matchedPhrase.trim(),
    });
    for (let k = tokenStartIdx; k < tokens.length; k++) tokens[k] = "";
    tokens[tokenStartIdx] = "[ĐÃ CHE SĐT VIẾT CHỮ THEO QUY ĐỊNH OYLG]";
  }

  sanitizedText = tokens.join("");

  return {
    originalText: text,
    sanitizedText,
    hasViolation: detectedItems.length > 0,
    detectedItems,
  };
}

// ----------------------------------------------------------------------------
// RÀO CHẮN #2 (M14 & M19.1): CẢNH BÁO AN TOÀN TÂM LÝ VỊ THÀNH NIÊN
// ----------------------------------------------------------------------------

export interface SafetyDetectionResult {
  level: SafetyLevel;
  triggeredKeywords: string[];
  allowAiAutoCounseling: false; // Bắt buộc FALSE: AI tuyệt đối không tự tư vấn tâm lý
  emergencyHotlines: Array<{ name: string; number: string; description: string }>;
  mandatoryActions: string[];
  ImmediateBannerMessage?: string;
}

const HIGH_RISK_PATTERNS = [
  "tự hại",
  "tự tử",
  "không muốn sống",
  "chết đi",
  "cắt tay",
  "bạo hành",
  "xâm hại",
  "đánh đập",
  "bỏ nhà đi",
  "uống thuốc ngủ",
];

const MEDIUM_RISK_PATTERNS = [
  "bỏ ăn kéo dài",
  "mất ngủ nhiều ngày",
  "hoảng loạn",
  "sợ đến trường",
  "bị bắt nạt",
  "cô lập",
  "khóc suốt",
  "kiệt sức hoàn toàn",
];

const LOW_RISK_PATTERNS = [
  "căng thẳng",
  "áp lực điểm số",
  "mệt mỏi",
  "buồn bất thường",
  "chán học",
];

export function detectSafetyRisk(text: string): SafetyDetectionResult {
  const normalized = text.toLowerCase();
  const highMatches = HIGH_RISK_PATTERNS.filter((kw) =>
    normalized.includes(kw)
  );
  const mediumMatches = MEDIUM_RISK_PATTERNS.filter((kw) =>
    normalized.includes(kw)
  );
  const lowMatches = LOW_RISK_PATTERNS.filter((kw) => normalized.includes(kw));

  const emergencyHotlines = [
    {
      name: "Tổng đài Quốc gia Bảo vệ Trẻ em",
      number: "111",
      description: "Hoạt động 24/7, miễn phí hoàn toàn – Hỗ trợ khẩn cấp bảo vệ trẻ em & tâm lý",
    },
    {
      name: "Cấp cứu Y tế Khẩn cấp",
      number: "115",
      description: "Hỗ trợ cấp cứu sức khỏe – y tế tức thời",
    },
  ];

  if (highMatches.length > 0) {
    return {
      level: "HIGH",
      triggeredKeywords: highMatches,
      allowAiAutoCounseling: false,
      emergencyHotlines,
      mandatoryActions: [
        "Hiển thị ngay lập tức số khẩn cấp 111 và 115 trên màn hình người dùng",
        "Khóa chế độ AI trả lời tự động – Không để AI tự tư vấn tâm lý",
        "Gửi Push + SMS khẩn cấp cho Cố vấn cuộc sống phụ trách và Quản lý chuyên môn tâm lý",
        "Mở Nhật ký sự vụ (Incident Log M14) phân quyền riêng tư cấp cao",
      ],
      ImmediateBannerMessage:
        "PHÁT HIỆN TÍN HIỆU KHẨN CẤP AN TOÀN TÂM LÝ (MỨC CAO): Vui lòng liên hệ ngay Tổng đài Quốc gia Bảo vệ Trẻ em 111 (miễn phí 24/7) hoặc Cấp cứu 115. Cố vấn tâm lý của OYLG đã được thông báo tức thời.",
    };
  }

  if (mediumMatches.length > 0) {
    return {
      level: "MEDIUM",
      triggeredKeywords: mediumMatches,
      allowAiAutoCounseling: false,
      emergencyHotlines,
      mandatoryActions: [
        "Tạo cờ an toàn mức TRUNG BÌNH (MEDIUM) trên Tháp điều khiển của Cố vấn cuộc sống",
        "Cam kết SLA: Cố vấn cuộc sống liên hệ trực tiếp trong vòng 24 giờ",
        "Ẩn nội dung chi tiết trên cổng Phụ huynh cho đến khi Cố vấn đánh giá và soạn bản tóm tắt phù hợp",
      ],
      ImmediateBannerMessage:
        "Hệ thống ghi nhận dấu hiệu cần hỗ trợ tâm lý (Mức Trung bình). Cố vấn cuộc sống sẽ liên hệ đồng hành trong vòng 24h.",
    };
  }

  if (lowMatches.length > 0) {
    return {
      level: "LOW",
      triggeredKeywords: lowMatches,
      allowAiAutoCounseling: false,
      emergencyHotlines: [],
      mandatoryActions: [
        "Gắn cờ THEO DÕI (LOW) vào Hồ sơ đồng hành (M20)",
        "Theo dõi chuỗi 3 buổi liên tiếp để cảnh báo sớm tình trạng quá tải học tập",
      ],
    };
  }

  return {
    level: "NONE",
    triggeredKeywords: [],
    allowAiAutoCounseling: false,
    emergencyHotlines: [],
    mandatoryActions: [],
  };
}

// ----------------------------------------------------------------------------
// RÀO CHẮN #3 (M01.4-7 & M20.12): CHỐNG LÀM PHIỀN PHỤ HUYNH (DIGEST ENGINE)
// ----------------------------------------------------------------------------

export type NotificationEventType =
  | "TEST_RESULT_NORMAL"
  | "POSITIVE_MILESTONE"
  | "HOMEWORK_MISSED_FIRST"
  | "HOMEWORK_MISSED_REPEAT"
  | "MOCK_EXAM_BELOW_TARGET"
  | "SAFETY_RED_ALERT"
  | "SESSION_REMINDER"
  | "BOARDING_SAFE_PICKUP";

export interface NotificationDeliveryPlan {
  eventType: NotificationEventType;
  targetRole: RoleCode;
  deliveryMode: "IMMEDIATE_PUSH_ZNS" | "DAILY_DIGEST_19H" | "WEEKLY_DIGEST_SUNDAY" | "SUPPRESSED";
  requiresCoachApprovalFirst: boolean;
  reason: string;
}

export function evaluateParentNotificationPolicy(
  eventType: NotificationEventType,
  parentAlreadyReceivedDailyDigestToday: boolean
): NotificationDeliveryPlan {
  switch (eventType) {
    case "SAFETY_RED_ALERT":
    case "SESSION_REMINDER":
    case "BOARDING_SAFE_PICKUP":
      return {
        eventType,
        targetRole: "PARENT",
        deliveryMode: "IMMEDIATE_PUSH_ZNS",
        requiresCoachApprovalFirst: false,
        reason: "Ngoại lệ ưu tiên (Cảnh báo Đỏ / Nhắc lịch học / Đưa đón nội trú an toàn) được gửi tức thời.",
      };
    case "MOCK_EXAM_BELOW_TARGET":
      return {
        eventType,
        targetRole: "PARENT",
        deliveryMode: "DAILY_DIGEST_19H",
        requiresCoachApprovalFirst: true,
        reason:
          "Cảnh báo điểm thi thử thấp phải qua Cố vấn cuộc sống duyệt và đính kèm phương án giải pháp trước khi gửi phụ huynh (M20.12).",
      };
    case "POSITIVE_MILESTONE":
    case "TEST_RESULT_NORMAL":
      return {
        eventType,
        targetRole: "PARENT",
        deliveryMode: "WEEKLY_DIGEST_SUNDAY",
        requiresCoachApprovalFirst: false,
        reason:
          "Tin vui, huy hiệu và kết quả bài kiểm tra thường kỳ được gộp vào Bản tin tuần để chống làm phiền phụ huynh (Mục 1.4-7).",
      };
    case "HOMEWORK_MISSED_FIRST":
      return {
        eventType,
        targetRole: "PARENT",
        deliveryMode: "SUPPRESSED",
        requiresCoachApprovalFirst: false,
        reason:
          "Lần đầu quên bài tập chỉ nhắc nhẹ Học sinh và báo Gia sư; chỉ báo Phụ huynh từ lần thứ 2 trở đi (Ma trận 20.12).",
      };
    case "HOMEWORK_MISSED_REPEAT":
    default:
      return {
        eventType,
        targetRole: "PARENT",
        deliveryMode: parentAlreadyReceivedDailyDigestToday
          ? "WEEKLY_DIGEST_SUNDAY"
          : "DAILY_DIGEST_19H",
        requiresCoachApprovalFirst: false,
        reason:
          "Gộp vào 1 Tin tổng hợp cuối ngày (tối đa 1 tin/ngày cho phụ huynh theo quy tắc M01.4-7).",
      };
  }
}

// ----------------------------------------------------------------------------
// RÀO CHẮN #4 (Mục 10.1 & 6.4): ẨN DANH DỮ LIỆU TRẺ EM TRƯỚC KHI GỌI AI QUỐC TẾ
// ----------------------------------------------------------------------------

export interface RawStudentAiContext {
  studentCode: string;
  fullName: string;
  phone?: string;
  parentName?: string;
  address?: string;
  schoolName?: string;
  grade: number;
  subjectScoresSummary: string;
}

export interface AnonymizedStudentAiPayload {
  pseudonymId: string;
  grade: number;
  sanitizedSummary: string;
  piiStrippedFields: string[];
  complianceStandard: string;
}

export function anonymizeForAiGateway(
  raw: RawStudentAiContext
): AnonymizedStudentAiPayload {
  let sanitizedSummary = raw.subjectScoresSummary;
  if (raw.fullName) {
    sanitizedSummary = sanitizedSummary.replaceAll(
      raw.fullName,
      `[${raw.studentCode}]`
    );
  }
  if (raw.schoolName) {
    sanitizedSummary = sanitizedSummary.replaceAll(
      raw.schoolName,
      "[TRƯỜNG_PHỔ_THÔNG]"
    );
  }
  const masked = maskContactInfo(sanitizedSummary);

  return {
    pseudonymId: raw.studentCode,
    grade: raw.grade,
    sanitizedSummary: masked.sanitizedText,
    piiStrippedFields: [
      "fullName",
      "phone",
      "parentName",
      "address",
      "schoolName",
    ],
    complianceStandard:
      "Nghị định 13/2023/NĐ-CP & Mục 10.1 OYLG (Máy chủ tại VN, ẩn danh 100% PII trẻ em trước khi gọi Claude API)",
  };
}
