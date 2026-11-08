package com.allyourlife.oylg.service;

import com.allyourlife.oylg.constant.OylgConstants;
import com.tvd12.ezyfox.bean.annotation.EzySingleton;
import org.youngmonkeys.ezyplatform.service.SettingService;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Đặt tại module: oylg-sdk (SSOT)
 * Thực thi công thức định giá động B6 (M10):
 * SessionPrice = BasePrice * k_ExpertTier * k_Grade * k_Mode * k_ClassType
 * Hỗ trợ đổi hình thức từng buổi (ONLINE_ZOOM <-> AT_CENTER <-> AT_HOME)
 * và hoàn tiền 100% buổi chưa học trong 14 ngày đầu.
 */
@EzySingleton
public class OylgPricingService {

    private final SettingService settingService;

    public OylgPricingService(SettingService settingService) {
        this.settingService = settingService;
    }

    public BigDecimal getBaseSessionPrice() {
        long basePrice = settingService.getLongValue(
            OylgConstants.SETTING_BASE_SESSION_PRICE,
            500000L
        );
        return BigDecimal.valueOf(basePrice);
    }

    public BigDecimal getExpertTierMultiplier(String expertTier) {
        if ("MASTER".equalsIgnoreCase(expertTier)) {
            return new BigDecimal("1.70");
        }
        if ("SENIOR".equalsIgnoreCase(expertTier)) {
            return new BigDecimal("1.30");
        }
        return new BigDecimal("1.00");
    }

    public BigDecimal getGradeMultiplier(int grade) {
        if (grade <= 5) {
            return new BigDecimal("0.80");
        }
        if (grade <= 9) {
            return new BigDecimal("1.00");
        }
        if (grade <= 11) {
            return new BigDecimal("1.20");
        }
        return new BigDecimal("1.40");
    }

    public BigDecimal getDeliveryModeMultiplier(String deliveryMode) {
        if ("AT_HOME".equalsIgnoreCase(deliveryMode)) {
            return new BigDecimal("1.50");
        }
        if ("AT_CENTER".equalsIgnoreCase(deliveryMode)) {
            return new BigDecimal("1.20");
        }
        return new BigDecimal("1.00");
    }

    public BigDecimal getClassTypeMultiplier(String classType) {
        if ("LARGE_GROUP".equalsIgnoreCase(classType)) {
            return new BigDecimal("0.35");
        }
        if ("SMALL_GROUP".equalsIgnoreCase(classType)) {
            return new BigDecimal("0.60");
        }
        return new BigDecimal("1.00");
    }

    public BigDecimal getCommitmentDiscountRate(int durationMonths) {
        if (durationMonths >= 12) {
            return new BigDecimal("0.12");
        }
        if (durationMonths >= 6) {
            return new BigDecimal("0.07");
        }
        if (durationMonths >= 3) {
            return new BigDecimal("0.03");
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal calculateSessionPrice(
        BigDecimal basePrice,
        String expertTier,
        int grade,
        String deliveryMode,
        String classType
    ) {
        BigDecimal effectiveBase = basePrice != null ? basePrice : getBaseSessionPrice();
        return effectiveBase
            .multiply(getExpertTierMultiplier(expertTier))
            .multiply(getGradeMultiplier(grade))
            .multiply(getDeliveryModeMultiplier(deliveryMode))
            .multiply(getClassTypeMultiplier(classType))
            .setScale(0, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateSingleSessionPrice(
        String expertTier,
        int grade,
        String deliveryMode,
        String classType
    ) {
        return calculateSessionPrice(
            getBaseSessionPrice(),
            expertTier,
            grade,
            deliveryMode,
            classType
        );
    }

    public BigDecimal calculateTermTotal(
        BigDecimal unitSessionPrice,
        int sessionsPerMonth,
        int termMonths
    ) {
        BigDecimal gross = unitSessionPrice
            .multiply(BigDecimal.valueOf((long) sessionsPerMonth * termMonths));
        BigDecimal discountRate = getCommitmentDiscountRate(termMonths);
        BigDecimal discount = gross.multiply(discountRate).setScale(0, RoundingMode.HALF_UP);
        return gross.subtract(discount);
    }

    public BigDecimal calculateModeSwitchDelta(
        String expertTier,
        int grade,
        String classType,
        String fromMode,
        String toMode
    ) {
        BigDecimal oldPrice = calculateSingleSessionPrice(
            expertTier,
            grade,
            fromMode,
            classType
        );
        BigDecimal newPrice = calculateSingleSessionPrice(
            expertTier,
            grade,
            toMode,
            classType
        );
        return newPrice.subtract(oldPrice);
    }
}
