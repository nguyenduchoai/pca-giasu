// ============================================================================
// PRICING, MODE SWITCHING & EXPERT KPI PAYOUT ENGINE (PHỤ LỤC B6, M09, M10, M11)
// ============================================================================

import {
  BillingTermMonths,
  ClassType,
  DeliveryMode,
  ExpertTier,
  GradeBracket,
} from "./types";

/**
 * Hệ số chuẩn theo Phụ lục B6 (v1.0)
 * Công thức: Giá 1 buổi/học sinh = Giá gốc × hệ số cấp chuyên gia × hệ số cấp học × hệ số hình thức × hệ số kiểu lớp
 */
export const EXPERT_TIER_FACTORS: Record<ExpertTier, number> = {
  1: 1.0,
  2: 1.3,
  3: 1.7,
};

export const GRADE_BRACKET_FACTORS: Record<GradeBracket, number> = {
  PRIMARY_1_5: 0.8,
  MIDDLE_6_8: 1.0,
  HIGH_10_11: 1.2,
  EXAM_PREP_9_12: 1.4,
};

export const DELIVERY_MODE_FACTORS: Record<DeliveryMode, number> = {
  ONLINE_ZOOM: 1.0,
  AT_CENTER: 1.2,
  AT_HOME: 1.5,
};

export const CLASS_TYPE_FACTORS: Record<ClassType, number> = {
  ONE_ON_ONE: 1.0,
  SMALL_GROUP: 0.6, // 2-5 học sinh
  LARGE_GROUP: 0.35, // 6-20 học sinh
};

/**
 * Ưu đãi đóng dài hạn (Phụ lục B3-25 & B8-2b):
 * 3 tháng giảm 3%, 6 tháng giảm 7%, 12 tháng giảm 12%
 */
export const LONG_TERM_DISCOUNT_RATES: Record<BillingTermMonths, number> = {
  1: 0,
  3: 0.03,
  6: 0.07,
  12: 0.12,
};

export function resolveGradeBracket(grade: number): GradeBracket {
  if (grade >= 1 && grade <= 5) return "PRIMARY_1_5";
  if (grade === 9 || grade === 12) return "EXAM_PREP_9_12";
  if (grade >= 6 && grade <= 8) return "MIDDLE_6_8";
  return "HIGH_10_11";
}

export interface SessionPricingInput {
  basePriceVnd: number;
  expertTier: ExpertTier;
  grade: number;
  deliveryMode: DeliveryMode;
  classType: ClassType;
}

export interface SessionPricingBreakdown {
  basePriceVnd: number;
  expertTierFactor: number;
  gradeBracket: GradeBracket;
  gradeFactor: number;
  deliveryModeFactor: number;
  classTypeFactor: number;
  combinedMultiplier: number;
  unitSessionPriceVnd: number;
}

/**
 * Tính giá 1 buổi học/học sinh theo đúng công thức hệ số Phụ lục B6
 */
export function calculateSessionPrice(
  input: SessionPricingInput
): SessionPricingBreakdown {
  const gradeBracket = resolveGradeBracket(input.grade);
  const expertTierFactor = EXPERT_TIER_FACTORS[input.expertTier];
  const gradeFactor = GRADE_BRACKET_FACTORS[gradeBracket];
  const deliveryModeFactor = DELIVERY_MODE_FACTORS[input.deliveryMode];
  const classTypeFactor = CLASS_TYPE_FACTORS[input.classType];

  const combinedMultiplier =
    Math.round(
      expertTierFactor *
        gradeFactor *
        deliveryModeFactor *
        classTypeFactor *
        10000
    ) / 10000;

  // Làm tròn đến 1.000đ gần nhất
  const unitSessionPriceVnd =
    Math.round((input.basePriceVnd * combinedMultiplier) / 1000) * 1000;

  return {
    basePriceVnd: input.basePriceVnd,
    expertTierFactor,
    gradeBracket,
    gradeFactor,
    deliveryModeFactor,
    classTypeFactor,
    combinedMultiplier,
    unitSessionPriceVnd,
  };
}

export interface PackageQuoteInput extends SessionPricingInput {
  sessionsPerWeek: number;
  termMonths: BillingTermMonths;
}

export interface PackageQuoteResult {
  sessionBreakdown: SessionPricingBreakdown;
  totalSessionsInTerm: number;
  monthlyGrossVnd: number;
  termGrossVnd: number;
  discountRate: number;
  discountAmountVnd: number;
  netPayableVnd: number;
  sixMonthReferenceValueVnd: number;
}

/**
 * Tính báo giá gói học theo kỳ (1 / 3 / 6 / 12 tháng) và giá trị quy đổi 6 tháng (dùng cho M18.5)
 */
export function calculatePackageQuote(
  input: PackageQuoteInput
): PackageQuoteResult {
  const sessionBreakdown = calculateSessionPrice(input);
  // 1 tháng trung bình 4.33 tuần, hoặc chuẩn hóa 4 tuần/tháng khi thu theo kỳ, riêng quy đổi 6 tháng M18.5 chốt = 26 tuần
  const sessionsPerMonth = input.sessionsPerWeek * 4;
  const totalSessionsInTerm = sessionsPerMonth * input.termMonths;
  const monthlyGrossVnd =
    sessionBreakdown.unitSessionPriceVnd * sessionsPerMonth;
  const termGrossVnd = monthlyGrossVnd * input.termMonths;

  const discountRate = LONG_TERM_DISCOUNT_RATES[input.termMonths];
  const discountAmountVnd = Math.round((termGrossVnd * discountRate) / 1000) * 1000;
  const netPayableVnd = termGrossVnd - discountAmountVnd;

  // Quy tắc B4-30: Gói tính theo buổi -> số buổi/tuần * đơn giá buổi * 26 tuần
  const sixMonthReferenceValueVnd =
    input.sessionsPerWeek * sessionBreakdown.unitSessionPriceVnd * 26;

  return {
    sessionBreakdown,
    totalSessionsInTerm,
    monthlyGrossVnd,
    termGrossVnd,
    discountRate,
    discountAmountVnd,
    netPayableVnd,
    sixMonthReferenceValueVnd,
  };
}

export interface ModeSwitchDiffResult {
  fromMode: DeliveryMode;
  toMode: DeliveryMode;
  fromPriceVnd: number;
  toPriceVnd: number;
  priceDiffVnd: number; // Dương: phụ huynh bù thêm; Âm: hoàn lại vào ví buổi học
  creditRatioAdjustment: number;
  actionSummary: string;
}

/**
 * M09.1: Đổi hình thức học linh động theo từng buổi (Online Zoom <-> Tại trung tâm <-> Tại nhà)
 * Tự động tính chênh lệch giá để trừ/hoàn vào ví buổi học.
 */
export function calculateModeSwitchDiff(
  baseInput: Omit<SessionPricingInput, "deliveryMode">,
  fromMode: DeliveryMode,
  toMode: DeliveryMode
): ModeSwitchDiffResult {
  const fromBreakdown = calculateSessionPrice({
    ...baseInput,
    deliveryMode: fromMode,
  });
  const toBreakdown = calculateSessionPrice({
    ...baseInput,
    deliveryMode: toMode,
  });

  const priceDiffVnd =
    toBreakdown.unitSessionPriceVnd - fromBreakdown.unitSessionPriceVnd;
  const creditRatioAdjustment =
    Math.round(
      (DELIVERY_MODE_FACTORS[toMode] / DELIVERY_MODE_FACTORS[fromMode]) * 100
    ) / 100;

  let actionSummary = "Giữ nguyên mức phí buổi học.";
  if (priceDiffVnd > 0) {
    actionSummary = `Phụ huynh cần bù thêm ${priceDiffVnd.toLocaleString("vi-VN")}đ (hoặc quy đổi hệ số ${creditRatioAdjustment}x trong ví buổi học).`;
  } else if (priceDiffVnd < 0) {
    actionSummary = `Hoàn lại ${Math.abs(priceDiffVnd).toLocaleString("vi-VN")}đ vào ví buổi học của học sinh.`;
  }

  return {
    fromMode,
    toMode,
    fromPriceVnd: fromBreakdown.unitSessionPriceVnd,
    toPriceVnd: toBreakdown.unitSessionPriceVnd,
    priceDiffVnd,
    creditRatioAdjustment,
    actionSummary,
  };
}

// ----------------------------------------------------------------------------
// M11 – ĐỐI SOÁT & CHI TRẢ CHUYÊN GIA (THÙ LAO CỐ ĐỊNH + THƯỞNG KPI QUÝ TỐI ĐA 10%)
// ----------------------------------------------------------------------------

export interface ExpertKpiEvaluationInput {
  fixedPayTotalQuarterVnd: number;
  activeStudentsCount: number;
  progressScore: number; // 0..100 (Trọng số 40% - Tốc độ lấp lỗ hổng)
  disciplineScore: number; // 0..100 (Trọng số 20% - Biên bản đúng hạn 24h, đúng giờ)
  csatScore: number; // 0..100 (Trọng số 20% - Điểm hài lòng sau buổi)
  retentionScore: number; // 0..100 (Trọng số 20% - Tỉ lệ gia hạn)
  reviewItemsCount?: number; // Số câu hỏi/YCCĐ duyệt thêm nếu là SUBJECT_LEAD
  reviewUnitRateVnd?: number;
}

export interface ExpertKpiEvaluationResult {
  weightedKpiScore: number; // 0..100
  bonusPercentage: number; // 0..0.10 (Tối đa 10%)
  kpiBonusVnd: number;
  subjectLeadReviewPayVnd: number;
  totalQuarterlyPayoutVnd: number;
  note: string;
}

/**
 * M11 (chốt v1.0): Thù lao cố định theo buổi + Thưởng KPI quý tối đa 10%
 * Trọng số: Tiến bộ 40% | Kỷ luật 20% | CSAT 20% | Giữ chân 20%
 * Nếu dưới 3 học sinh trong quý thì chỉ xét Kỷ luật & CSAT (quy chuẩn lại thang 100).
 */
export function calculateExpertQuarterlyPayout(
  input: ExpertKpiEvaluationInput
): ExpertKpiEvaluationResult {
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  const p = clamp(input.progressScore);
  const d = clamp(input.disciplineScore);
  const c = clamp(input.csatScore);
  const r = clamp(input.retentionScore);

  let weightedKpiScore: number;
  let note: string;

  if (input.activeStudentsCount < 3) {
    // M11: Chuyên gia có dưới 3 học sinh trong quý không xét tiêu chí tiến bộ và gia hạn
    weightedKpiScore = Math.round((d * 0.5 + c * 0.5) * 100) / 100;
    note =
      "Chuyên gia có dưới 3 học sinh trong quý: chỉ xét tiêu chí Kỷ luật (50%) và CSAT (50%).";
  } else {
    weightedKpiScore =
      Math.round((p * 0.4 + d * 0.2 + c * 0.2 + r * 0.2) * 100) / 100;
    note =
      "Đủ điều kiện xét cả 4 tiêu chí KPI quý: Tiến bộ (40%), Kỷ luật (20%), CSAT (20%), Gia hạn (20%).";
  }

  // 100 điểm KPI = 10% thưởng
  const bonusPercentage = Math.round((weightedKpiScore / 100) * 0.1 * 10000) / 10000;
  const kpiBonusVnd = Math.round(input.fixedPayTotalQuarterVnd * bonusPercentage);
  const subjectLeadReviewPayVnd =
    (input.reviewItemsCount ?? 0) * (input.reviewUnitRateVnd ?? 15000);

  return {
    weightedKpiScore,
    bonusPercentage,
    kpiBonusVnd,
    subjectLeadReviewPayVnd,
    totalQuarterlyPayoutVnd:
      input.fixedPayTotalQuarterVnd + kpiBonusVnd + subjectLeadReviewPayVnd,
    note,
  };
}
