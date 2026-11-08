// ============================================================================
// 2-TIER LEGAL COMMISSION ENGINE – M18.5 & 18.5b (PAY_AS_COLLECTED)
// Thiết kế đúng pháp luật (NĐ 40/2018): Cứng 2 cấp, không thưởng tuyển người,
// DTHH = max(Kỳ đầu, 6 tháng), chi dần theo tiền thực thu, giữ 14 ngày.
// ============================================================================

export type PackageBillingModel = "MONTHLY" | "PER_SESSION" | "ONE_TIME";

export type OrderKind = "NEW" | "RENEWAL" | "ADD_ON";

export type SellerRole = "SALES_AGENT" | "SALES_LEADER" | "NONE";

export type AdvisedByRole = "SALES_AGENT" | "SALES_LEADER" | "CARE_AGENT" | "ORGANIC";

export interface CommissionOrderInput {
  orderCode: string;
  packageBillingModel: PackageBillingModel;
  firstPaymentVnd: number;
  monthlyFeeVnd?: number;
  sessionsPerWeek?: number;
  pricePerSessionVnd?: number;
  orderKind: OrderKind;
  sellerRole: SellerRole;
  advisedByRole: AdvisedByRole;
  isSelfPurchase?: boolean;
  /** Danh sách các kỳ tiền thực thu dự kiến hoặc thực tế để tính lịch chi dần */
  collectedInstallmentsVnd: number[];
}

export interface CommissionInstallmentTranche {
  installmentIndex: number;
  collectedAmountVnd: number;
  cumulativeCollectedVnd: number;
  eligibleBasePortionVnd: number;
  ctvPayoutVnd: number;
  leaderPayoutVnd: number;
  totalTranchePayoutVnd: number;
  statusNote: string;
}

export interface CommissionPlanResult {
  orderCode: string;
  isEligible: boolean;
  ineligibleReason?: string;
  firstPaymentVnd: number;
  sixMonthValueVnd: number;
  commissionBaseVnd: number; // DTHH = max(kỳ đầu, giá trị 6 tháng)
  ctvRate: number;
  leaderRate: number;
  totalLockedCtvCommissionVnd: number;
  totalLockedLeaderCommissionVnd: number;
  totalLockedCommissionVnd: number;
  holdDays: number; // 14 ngày theo hạn hoàn tiền
  customerOwnershipLockDays: number; // 30 ngày giữ khách cho CTV
  isSelfPurchaseAuditFlag: boolean;
  legalComplianceBadges: string[];
  tranches: CommissionInstallmentTranche[];
  totalDisbursedCtvVnd: number;
  totalDisbursedLeaderVnd: number;
  uncollectedCancelledVnd: number;
}

export function calculateSixMonthReference(input: {
  packageBillingModel: PackageBillingModel;
  firstPaymentVnd: number;
  monthlyFeeVnd?: number;
  sessionsPerWeek?: number;
  pricePerSessionVnd?: number;
}): number {
  switch (input.packageBillingModel) {
    case "MONTHLY":
      return (input.monthlyFeeVnd ?? input.firstPaymentVnd) * 6;
    case "PER_SESSION":
      return (
        (input.sessionsPerWeek ?? 2) *
        (input.pricePerSessionVnd ?? 300000) *
        26
      );
    case "ONE_TIME":
    default:
      return input.firstPaymentVnd;
  }
}

export function calculateOrderCommissionPlan(
  input: CommissionOrderInput
): CommissionPlanResult {
  const holdDays = 14;
  const customerOwnershipLockDays = 30;
  const legalComplianceBadges = [
    "Cố định cứng 2 cấp (CTV 10% + Leader 5% hoặc Leader tự bán 15%)",
    "0đ thưởng tuyển dụng CTV – Mọi hoa hồng gắn với đơn hàng thật",
    "Chi dần theo tiền thực thu (PAY_AS_COLLECTED) – Không chi khống",
    "Giữ 14 ngày chờ hết hạn hoàn tiền 100%",
  ];

  const sixMonthValueVnd = calculateSixMonthReference(input);
  const commissionBaseVnd = Math.max(input.firstPaymentVnd, sixMonthValueVnd);

  // 1. Kiểm tra điều kiện loại trừ hoa hồng (M18.5)
  if (input.orderKind === "RENEWAL") {
    return {
      orderCode: input.orderCode,
      isEligible: false,
      ineligibleReason:
        "Đơn gia hạn (RENEWAL) không tính hoa hồng cho CTV/Leader theo quy định M18.5.",
      firstPaymentVnd: input.firstPaymentVnd,
      sixMonthValueVnd,
      commissionBaseVnd: 0,
      ctvRate: 0,
      leaderRate: 0,
      totalLockedCtvCommissionVnd: 0,
      totalLockedLeaderCommissionVnd: 0,
      totalLockedCommissionVnd: 0,
      holdDays,
      customerOwnershipLockDays,
      isSelfPurchaseAuditFlag: Boolean(input.isSelfPurchase),
      legalComplianceBadges,
      tranches: [],
      totalDisbursedCtvVnd: 0,
      totalDisbursedLeaderVnd: 0,
      uncollectedCancelledVnd: 0,
    };
  }

  if (input.orderKind === "ADD_ON" && input.advisedByRole === "CARE_AGENT") {
    return {
      orderCode: input.orderCode,
      isEligible: false,
      ineligibleReason:
        "Đơn mua thêm (ADD_ON) do nhân viên CSKH (CARE_AGENT) tư vấn không phát sinh hoa hồng CTV (M18.5).",
      firstPaymentVnd: input.firstPaymentVnd,
      sixMonthValueVnd,
      commissionBaseVnd: 0,
      ctvRate: 0,
      leaderRate: 0,
      totalLockedCtvCommissionVnd: 0,
      totalLockedLeaderCommissionVnd: 0,
      totalLockedCommissionVnd: 0,
      holdDays,
      customerOwnershipLockDays,
      isSelfPurchaseAuditFlag: Boolean(input.isSelfPurchase),
      legalComplianceBadges,
      tranches: [],
      totalDisbursedCtvVnd: 0,
      totalDisbursedLeaderVnd: 0,
      uncollectedCancelledVnd: 0,
    };
  }

  if (input.sellerRole === "NONE") {
    return {
      orderCode: input.orderCode,
      isEligible: false,
      ineligibleReason:
        "Khách tự đến (Organic) không qua mã giới thiệu/CTV nên không phát sinh hoa hồng.",
      firstPaymentVnd: input.firstPaymentVnd,
      sixMonthValueVnd,
      commissionBaseVnd: 0,
      ctvRate: 0,
      leaderRate: 0,
      totalLockedCtvCommissionVnd: 0,
      totalLockedLeaderCommissionVnd: 0,
      totalLockedCommissionVnd: 0,
      holdDays,
      customerOwnershipLockDays,
      isSelfPurchaseAuditFlag: Boolean(input.isSelfPurchase),
      legalComplianceBadges,
      tranches: [],
      totalDisbursedCtvVnd: 0,
      totalDisbursedLeaderVnd: 0,
      uncollectedCancelledVnd: 0,
    };
  }

  // 2. Xác định tỉ lệ hoa hồng theo cấp bán
  let ctvRate = 0;
  let leaderRate = 0;

  if (input.sellerRole === "SALES_AGENT") {
    ctvRate = 0.1; // 10% trực tiếp
    leaderRate = 0.05; // 5% quản lý nhóm
  } else if (input.sellerRole === "SALES_LEADER") {
    ctvRate = 0;
    leaderRate = 0.15; // Leader tự bán nhận 15% (10% trực tiếp + 5% quản lý)
  }

  const totalLockedCtvCommissionVnd = Math.round(commissionBaseVnd * ctvRate);
  const totalLockedLeaderCommissionVnd = Math.round(
    commissionBaseVnd * leaderRate
  );
  const totalLockedCommissionVnd =
    totalLockedCtvCommissionVnd + totalLockedLeaderCommissionVnd;

  // 3. Chi dần theo tiền thực thu (PAY_AS_COLLECTED)
  let cumulativeCollectedVnd = 0;
  let totalDisbursedCtvVnd = 0;
  let totalDisbursedLeaderVnd = 0;

  const tranches: CommissionInstallmentTranche[] =
    input.collectedInstallmentsVnd.map((amountVnd, idx) => {
      const prevCumulative = cumulativeCollectedVnd;
      cumulativeCollectedVnd += amountVnd;

      // Phần tiền kỳ này nằm trong trần DTHH
      const remainingBaseBefore = Math.max(
        0,
        commissionBaseVnd - prevCumulative
      );
      const eligibleBasePortionVnd = Math.min(amountVnd, remainingBaseBefore);

      const ctvPayoutVnd = Math.round(eligibleBasePortionVnd * ctvRate);
      const leaderPayoutVnd = Math.round(eligibleBasePortionVnd * leaderRate);
      totalDisbursedCtvVnd += ctvPayoutVnd;
      totalDisbursedLeaderVnd += leaderPayoutVnd;

      let statusNote = "Chi theo tỉ lệ tiền thực thu kỳ này ÷ DTHH";
      if (eligibleBasePortionVnd === 0) {
        statusNote =
          "Đã chi đủ 100% tổng hoa hồng DTHH từ các kỳ trước – Kỳ này không phát sinh thêm";
      } else if (cumulativeCollectedVnd >= commissionBaseVnd) {
        statusNote = "Hoàn tất 100% hạn mức hoa hồng DTHH sau kỳ thu này";
      }

      return {
        installmentIndex: idx + 1,
        collectedAmountVnd: amountVnd,
        cumulativeCollectedVnd,
        eligibleBasePortionVnd,
        ctvPayoutVnd,
        leaderPayoutVnd,
        totalTranchePayoutVnd: ctvPayoutVnd + leaderPayoutVnd,
        statusNote,
      };
    });

  const uncollectedCancelledVnd = Math.max(
    0,
    totalLockedCommissionVnd - (totalDisbursedCtvVnd + totalDisbursedLeaderVnd)
  );

  return {
    orderCode: input.orderCode,
    isEligible: true,
    firstPaymentVnd: input.firstPaymentVnd,
    sixMonthValueVnd,
    commissionBaseVnd,
    ctvRate,
    leaderRate,
    totalLockedCtvCommissionVnd,
    totalLockedLeaderCommissionVnd,
    totalLockedCommissionVnd,
    holdDays,
    customerOwnershipLockDays,
    isSelfPurchaseAuditFlag: Boolean(input.isSelfPurchase),
    legalComplianceBadges,
    tranches,
    totalDisbursedCtvVnd,
    totalDisbursedLeaderVnd,
    uncollectedCancelledVnd,
  };
}
