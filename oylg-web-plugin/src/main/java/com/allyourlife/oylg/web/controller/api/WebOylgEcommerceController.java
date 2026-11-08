package com.allyourlife.oylg.web.controller.api;

import com.allyourlife.oylg.service.OylgCommissionService;
import com.allyourlife.oylg.service.OylgPricingService;
import com.tvd12.ezyhttp.core.response.ResponseEntity;
import com.tvd12.ezyhttp.server.core.annotation.Controller;
import com.tvd12.ezyhttp.server.core.annotation.DoGet;
import com.tvd12.ezyhttp.server.core.annotation.DoPost;
import com.tvd12.ezyhttp.server.core.annotation.RequestBody;
import com.tvd12.ezyhttp.server.core.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Controller("/api/v1/oylg/ecommerce")
public class WebOylgEcommerceController {

    private final OylgPricingService pricingService;
    private final OylgCommissionService commissionService;

    public WebOylgEcommerceController(
        OylgPricingService pricingService,
        OylgCommissionService commissionService
    ) {
        this.pricingService = pricingService;
        this.commissionService = commissionService;
    }

    @DoGet("/quote")
    public ResponseEntity calculateDynamicPackageQuote(
        @RequestParam(value = "basePrice", defaultValue = "200000") BigDecimal basePrice,
        @RequestParam(value = "expertTier", defaultValue = "STANDARD") String expertTier,
        @RequestParam(value = "grade", defaultValue = "9") int grade,
        @RequestParam(value = "deliveryMode", defaultValue = "AT_CENTER") String deliveryMode,
        @RequestParam(value = "classType", defaultValue = "ONE_ON_ONE") String classType,
        @RequestParam(value = "sessionsPerMonth", defaultValue = "8") int sessionsPerMonth,
        @RequestParam(value = "termMonths", defaultValue = "6") int termMonths
    ) {
        BigDecimal unitSessionPrice = pricingService.calculateSessionPrice(
            basePrice,
            expertTier,
            grade,
            deliveryMode,
            classType
        );
        BigDecimal netTermAmount = pricingService.calculateTermTotal(
            unitSessionPrice,
            sessionsPerMonth,
            termMonths
        );
        Map<String, Object> payload = new HashMap<>();
        payload.put("unitSessionPriceVnd", unitSessionPrice);
        payload.put("totalSessionsInTerm", sessionsPerMonth * termMonths);
        payload.put("netPayableVnd", netTermAmount);
        payload.put("refundGuaranteeDays", 14);
        return ResponseEntity.ok(payload);
    }

    @DoPost("/checkout-vietqr")
    public ResponseEntity createVietQrEcommerceOrder(
        @RequestBody Map<String, Object> request
    ) {
        BigDecimal paidAmount = new BigDecimal(
            String.valueOf(request.getOrDefault("netAmountVnd", "2490000"))
        );
        BigDecimal sixMonthValue = new BigDecimal(
            String.valueOf(request.getOrDefault("sixMonthReferenceVnd", paidAmount.toString()))
        );
        boolean isSelfPurchase = Boolean.parseBoolean(
            String.valueOf(request.getOrDefault("isSelfPurchase", "false"))
        );
        boolean isCareUpsell = Boolean.parseBoolean(
            String.valueOf(request.getOrDefault("isCareUpsell", "false"))
        );
        boolean isDirectByLeader = Boolean.parseBoolean(
            String.valueOf(request.getOrDefault("isDirectByLeader", "false"))
        );

        OylgCommissionService.CommissionSplit split =
            commissionService.calculatePayAsCollectedSplit(
                paidAmount,
                sixMonthValue,
                paidAmount,
                isSelfPurchase,
                isCareUpsell,
                isDirectByLeader
            );

        Map<String, Object> response = new HashMap<>();
        response.put("orderCode", "ORD-2026-" + (System.currentTimeMillis() % 10000));
        response.put("paymentMethod", "VIETQR_PAYOS");
        response.put("paymentStatus", "PAID");
        response.put("netPaidAmountVnd", paidAmount);
        response.put("dthhCommissionBaseVnd", split.getDthhBase());
        response.put("unlockedTier1RepCommissionVnd", split.getUnlockedRepAmount());
        response.put("unlockedTier2LeaderCommissionVnd", split.getUnlockedLeaderAmount());
        return ResponseEntity.ok(response);
    }
}
