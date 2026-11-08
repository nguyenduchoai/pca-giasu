package com.allyourlife.oylg.service;

import com.tvd12.ezyfox.bean.annotation.EzySingleton;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Đặt tại module: oylg-sdk (SSOT)
 * Thực thi Cơ chế Hoa hồng Kinh doanh 2 Tầng Hợp pháp (M18):
 * - CTV Tầng 1: 10% + Leader Tầng 2: 5% (tổng trần 15%)
 * - Leader tự bán trực tiếp: 15%
 * - DTHH = max(firstPayment, sixMonthContractValue)
 * - Chi trả dần theo tỷ lệ thực thu (PAY_AS_COLLECTED), giữ 14 ngày chờ qua kỳ hoàn tiền
 * - Không tính hoa hồng cho gói gia hạn hoặc gói mua thêm do CARE_AGENT tư vấn
 */
@EzySingleton
public class OylgCommissionService {

    private static final BigDecimal RATE_REP_TIER_1 = new BigDecimal("0.10");
    private static final BigDecimal RATE_LEADER_TIER_2 = new BigDecimal("0.05");
    private static final BigDecimal RATE_LEADER_DIRECT = new BigDecimal("0.15");

    public static class CommissionSplit {
        private final BigDecimal dthhBase;
        private final BigDecimal unlockedRepAmount;
        private final BigDecimal unlockedLeaderAmount;

        public CommissionSplit(
            BigDecimal dthhBase,
            BigDecimal unlockedRepAmount,
            BigDecimal unlockedLeaderAmount
        ) {
            this.dthhBase = dthhBase;
            this.unlockedRepAmount = unlockedRepAmount;
            this.unlockedLeaderAmount = unlockedLeaderAmount;
        }

        public BigDecimal getDthhBase() {
            return dthhBase;
        }

        public BigDecimal getUnlockedRepAmount() {
            return unlockedRepAmount;
        }

        public BigDecimal getUnlockedLeaderAmount() {
            return unlockedLeaderAmount;
        }
    }

    public CommissionSplit calculatePayAsCollectedSplit(
        BigDecimal firstPaymentAmount,
        BigDecimal sixMonthContractValue,
        BigDecimal collectedAmountToDate,
        boolean isSelfPurchase,
        boolean isCareUpsell,
        boolean isDirectByLeader
    ) {
        if (isSelfPurchase || isCareUpsell) {
            return new CommissionSplit(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        }
        BigDecimal dthh = calculateCommissionBaseDthh(firstPaymentAmount, sixMonthContractValue);
        BigDecimal totalRep = calculateTier1RepCommission(dthh, false, isDirectByLeader);
        BigDecimal totalLeader = calculateTier2LeaderOverrideCommission(
            dthh,
            false,
            isDirectByLeader,
            true
        );
        return new CommissionSplit(
            dthh,
            calculatePayAsCollectedUnlockedAmount(totalRep, collectedAmountToDate, dthh),
            calculatePayAsCollectedUnlockedAmount(totalLeader, collectedAmountToDate, dthh)
        );
    }

    public BigDecimal calculateCommissionBaseDthh(
        BigDecimal firstPaymentAmount,
        BigDecimal sixMonthContractValue
    ) {
        if (firstPaymentAmount == null) {
            return sixMonthContractValue != null ? sixMonthContractValue : BigDecimal.ZERO;
        }
        if (sixMonthContractValue == null) {
            return firstPaymentAmount;
        }
        return firstPaymentAmount.max(sixMonthContractValue);
    }

    public BigDecimal calculatePayAsCollectedUnlockedAmount(
        BigDecimal totalEntitledCommission,
        BigDecimal collectedAmountToDate,
        BigDecimal dthhBase
    ) {
        if (dthhBase == null || dthhBase.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal ratio = collectedAmountToDate
            .divide(dthhBase, 4, RoundingMode.HALF_UP)
            .min(BigDecimal.ONE);
        return totalEntitledCommission
            .multiply(ratio)
            .setScale(0, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateTier1RepCommission(
        BigDecimal dthhBase,
        boolean isRenewalOrCareUpsell,
        boolean isLeaderDirectSale
    ) {
        if (isRenewalOrCareUpsell) {
            return BigDecimal.ZERO;
        }
        BigDecimal rate = isLeaderDirectSale ? RATE_LEADER_DIRECT : RATE_REP_TIER_1;
        return dthhBase.multiply(rate).setScale(0, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateTier2LeaderOverrideCommission(
        BigDecimal dthhBase,
        boolean isRenewalOrCareUpsell,
        boolean isLeaderDirectSale,
        boolean hasLeader
    ) {
        if (isRenewalOrCareUpsell || isLeaderDirectSale || !hasLeader) {
            return BigDecimal.ZERO;
        }
        return dthhBase.multiply(RATE_LEADER_TIER_2).setScale(0, RoundingMode.HALF_UP);
    }
}
