import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateSessionPrice,
  calculatePackageQuote,
  calculateModeSwitchDiff,
  calculateExpertQuarterlyPayout,
  calculateOrderCommissionPlan,
  traceAdaptiveKnowledgeGraph,
  maskContactInfo,
  detectSafetyRisk,
  evaluateParentNotificationPolicy,
  anonymizeForAiGateway,
} from "../index";

describe("OYLG Core Business & AI Guardrail Engines (v1.0)", () => {
  it("B6 Pricing Formula: calculates exact multiplier for Tier 2, THPT, At Home, 1-on-1 (2.34x)", () => {
    const res = calculateSessionPrice({
      basePriceVnd: 200_000,
      expertTier: 2,
      grade: 10,
      deliveryMode: "AT_HOME",
      classType: "ONE_ON_ONE",
    });
    // 1.3 * 1.2 * 1.5 * 1.0 = 2.34
    assert.equal(res.combinedMultiplier, 2.34);
    assert.equal(res.unitSessionPriceVnd, 468_000);
  });

  it("B6 Pricing Formula: calculates Online Small Group for same Tier 2 THPT tutor (0.936x)", () => {
    const res = calculateSessionPrice({
      basePriceVnd: 200_000,
      expertTier: 2,
      grade: 10,
      deliveryMode: "ONLINE_ZOOM",
      classType: "SMALL_GROUP",
    });
    // 1.3 * 1.2 * 1.0 * 0.6 = 0.936
    assert.equal(res.combinedMultiplier, 0.936);
    assert.equal(res.unitSessionPriceVnd, 187_000);
  });

  it("B3-25 Long-term discounts: applies 3%, 7%, 12% for 3, 6, 12 months", () => {
    const quote12m = calculatePackageQuote({
      basePriceVnd: 200_000,
      expertTier: 1,
      grade: 7,
      deliveryMode: "ONLINE_ZOOM",
      classType: "ONE_ON_ONE",
      sessionsPerWeek: 2,
      termMonths: 12,
    });
    assert.equal(quote12m.discountRate, 0.12);
    assert.equal(quote12m.termGrossVnd, 19_200_000);
    assert.equal(quote12m.netPayableVnd, 16_896_000);
  });

  it("M09.1 Mode Switch: computes exact price difference between Online Zoom and At Home", () => {
    const diff = calculateModeSwitchDiff(
      {
        basePriceVnd: 200_000,
        expertTier: 2,
        grade: 9,
        classType: "ONE_ON_ONE",
      },
      "ONLINE_ZOOM",
      "AT_HOME"
    );
    assert.ok(diff.priceDiffVnd > 0);
    assert.equal(diff.creditRatioAdjustment, 1.5);
  });

  it("M11 Expert KPI Payout: caps quarterly KPI bonus at 10% and handles <3 students rule", () => {
    const fullKpi = calculateExpertQuarterlyPayout({
      fixedPayTotalQuarterVnd: 30_000_000,
      activeStudentsCount: 8,
      progressScore: 95,
      disciplineScore: 100,
      csatScore: 90,
      retentionScore: 85,
      reviewItemsCount: 50,
      reviewUnitRateVnd: 15_000,
    });
    // Weighted = 95*0.4 + 100*0.2 + 90*0.2 + 85*0.2 = 38 + 20 + 18 + 17 = 93 -> 9.3% bonus
    assert.equal(fullKpi.weightedKpiScore, 93);
    assert.equal(fullKpi.bonusPercentage, 0.093);
    assert.equal(fullKpi.kpiBonusVnd, 2_790_000);
    assert.equal(fullKpi.subjectLeadReviewPayVnd, 750_000);
  });

  it("M18.5 Commission Engine: CTV 10% + Leader 5% on max(firstPayment, 6m) with PAY_AS_COLLECTED", () => {
    // Ví dụ bảng M18.5: Gói cố vấn 4 triệu/tháng, đóng theo tháng, CTV A1 bán -> DTHH = 24 triệu
    // Học sinh học 3 tháng rồi dừng -> CTV nhận 1.2M, Leader nhận 600k, phần còn lại tự hủy
    const plan = calculateOrderCommissionPlan({
      orderCode: "ORD-2026-001",
      packageBillingModel: "MONTHLY",
      firstPaymentVnd: 4_000_000,
      monthlyFeeVnd: 4_000_000,
      orderKind: "NEW",
      sellerRole: "SALES_AGENT",
      advisedByRole: "SALES_AGENT",
      collectedInstallmentsVnd: [4_000_000, 4_000_000, 4_000_000],
    });

    assert.equal(plan.commissionBaseVnd, 24_000_000);
    assert.equal(plan.totalLockedCtvCommissionVnd, 2_400_000);
    assert.equal(plan.totalLockedLeaderCommissionVnd, 1_200_000);
    assert.equal(plan.totalDisbursedCtvVnd, 1_200_000);
    assert.equal(plan.totalDisbursedLeaderVnd, 600_000);
    assert.equal(plan.uncollectedCancelledVnd, 1_800_000);
  });

  it("M18.5 Commission Engine: Leader self-sell receives 15%, Renewal & CARE_AGENT Add-on receive 0", () => {
    const leaderSelf = calculateOrderCommissionPlan({
      orderCode: "ORD-2026-002",
      packageBillingModel: "PER_SESSION",
      firstPaymentVnd: 2_400_000,
      sessionsPerWeek: 2,
      pricePerSessionVnd: 300_000,
      orderKind: "NEW",
      sellerRole: "SALES_LEADER",
      advisedByRole: "SALES_LEADER",
      collectedInstallmentsVnd: [15_600_000],
    });
    // 2 * 300k * 26 = 15.6M; 15% = 2,340,000
    assert.equal(leaderSelf.commissionBaseVnd, 15_600_000);
    assert.equal(leaderSelf.totalLockedLeaderCommissionVnd, 2_340_000);

    const careAddon = calculateOrderCommissionPlan({
      orderCode: "ORD-2026-003",
      packageBillingModel: "MONTHLY",
      firstPaymentVnd: 4_000_000,
      monthlyFeeVnd: 4_000_000,
      orderKind: "ADD_ON",
      sellerRole: "SALES_AGENT",
      advisedByRole: "CARE_AGENT",
      collectedInstallmentsVnd: [4_000_000],
    });
    assert.equal(careAddon.isEligible, false);
    assert.equal(careAddon.totalLockedCommissionVnd, 0);
  });

  it("M05/M06.2 Adaptive Knowledge Tracing: traces back from Grade 9 failure to pinpoint Grade 8 Root Gap", () => {
    const result = traceAdaptiveKnowledgeGraph([
      { unitCode: "TOAN.07.SHT.02", pMastery: 0.85 }, // Đạt lớp 7 (suy luận luôn lớp 6 ĐẠT)
      { unitCode: "TOAN.08.HDT.01", pMastery: 0.35 }, // Hổng Hằng đẳng thức lớp 8
      { unitCode: "TOAN.08.PTB1.03", pMastery: 0.40 }, // Hổng Phương trình lớp 8 (hệ quả)
      { unitCode: "TOAN.09.CBH.01", pMastery: 0.25 }, // Sai Căn bậc hai lớp 9 (hệ quả)
    ]);

    assert.equal(result.rootGaps.length, 1);
    assert.equal(result.rootGaps[0].code, "TOAN.08.HDT.01");
    // Kiểm tra TOAN.06.PS.01 được suy luận ĐẠT (INFERRED_MASTERED)
    const grade6Unit = result.evaluatedUnits.find(
      (u) => u.code === "TOAN.06.PS.01"
    );
    assert.equal(grade6Unit?.status, "INFERRED_MASTERED");
  });

  it("Guardrail #1 & #2 & #3 & #4: masks phone/Zalo (including Vietnamese word-numbers), detects M14 safety, and anonymizes PII", () => {
    const masked = maskContactInfo(
      "Chị kết bạn zalo.me/giasutoan hoặc gọi số 0987.654.321 hay không chín một hai ba bốn năm sáu bảy tám nhé!"
    );
    assert.equal(masked.hasViolation, true);
    assert.ok(!masked.sanitizedText.includes("0987.654.321"));
    assert.ok(!masked.sanitizedText.includes("zalo.me/giasutoan"));

    const safety = detectSafetyRisk(
      "Dạo này em áp lực quá, em từng nghĩ đến việc tự hại và bỏ nhà đi"
    );
    assert.equal(safety.level, "HIGH");
    assert.equal(safety.allowAiAutoCounseling, false);
    assert.ok(safety.emergencyHotlines.some((h) => h.number === "111"));

    const digest = evaluateParentNotificationPolicy("POSITIVE_MILESTONE", false);
    assert.equal(digest.deliveryMode, "WEEKLY_DIGEST_SUNDAY");

    const anon = anonymizeForAiGateway({
      studentCode: "HS-2026-0089",
      fullName: "Nguyễn Minh Khôi",
      schoolName: "THCS Nguyễn Du Đắk Lắk",
      grade: 9,
      subjectScoresSummary:
        "Học sinh Nguyễn Minh Khôi tại THCS Nguyễn Du Đắk Lắk cần bổ trợ TOAN.08.HDT.01, SĐT mẹ 0912345678.",
    });
    assert.ok(!anon.sanitizedSummary.includes("Nguyễn Minh Khôi"));
    assert.ok(!anon.sanitizedSummary.includes("0912345678"));
    assert.ok(anon.sanitizedSummary.includes("[HS-2026-0089]"));
  });
});
