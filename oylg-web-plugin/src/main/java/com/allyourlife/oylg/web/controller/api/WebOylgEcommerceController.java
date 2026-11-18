package com.allyourlife.oylg.web.controller.api;

import com.allyourlife.oylg.entity.OylgConsultationLead;
import com.allyourlife.oylg.entity.OylgEcommerceOrderWallet;
import com.allyourlife.oylg.entity.OylgGroupClass;
import com.allyourlife.oylg.entity.OylgLessonRecord;
import com.allyourlife.oylg.entity.OylgQuestionItem;
import com.allyourlife.oylg.entity.OylgStudentProfile;
import com.allyourlife.oylg.service.OylgCommissionService;
import com.allyourlife.oylg.service.OylgGuardrailService;
import com.allyourlife.oylg.service.OylgPlatformService;
import com.allyourlife.oylg.service.OylgPricingService;
import com.tvd12.ezyhttp.core.response.ResponseEntity;
import com.tvd12.ezyhttp.server.core.annotation.Api;
import com.tvd12.ezyhttp.server.core.annotation.Controller;
import com.tvd12.ezyhttp.server.core.annotation.DoGet;
import com.tvd12.ezyhttp.server.core.annotation.DoPost;
import com.tvd12.ezyhttp.server.core.annotation.PathVariable;
import com.tvd12.ezyhttp.server.core.annotation.RequestBody;
import com.tvd12.ezyhttp.server.core.annotation.RequestParam;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Api
@Controller("/api/v1/oylg")
public class WebOylgEcommerceController {

    private final OylgPricingService pricingService;
    private final OylgCommissionService commissionService;
    private final OylgGuardrailService guardrailService;
    private final OylgPlatformService platformService;

    public WebOylgEcommerceController(
        OylgPricingService pricingService,
        OylgCommissionService commissionService,
        OylgGuardrailService guardrailService,
        OylgPlatformService platformService
    ) {
        this.pricingService = pricingService;
        this.commissionService = commissionService;
        this.guardrailService = guardrailService;
        this.platformService = platformService;
    }

    @DoGet("/ecommerce/quote")
    public ResponseEntity calculateDynamicPackageQuote(
        @RequestParam(value = "basePrice", defaultValue = "0") BigDecimal basePrice,
        @RequestParam(value = "expertTier", defaultValue = "SENIOR") String expertTier,
        @RequestParam(value = "grade", defaultValue = "9") int grade,
        @RequestParam(value = "deliveryMode", defaultValue = "AT_CENTER") String deliveryMode,
        @RequestParam(value = "classType", defaultValue = "ONE_ON_ONE") String classType,
        @RequestParam(value = "sessionsPerMonth", defaultValue = "8") int sessionsPerMonth,
        @RequestParam(value = "termMonths", defaultValue = "6") int termMonths
    ) {
        BigDecimal effectiveBase = (basePrice != null && basePrice.compareTo(BigDecimal.ZERO) > 0)
            ? basePrice
            : pricingService.getBaseSessionPrice();
        BigDecimal unitSessionPrice = pricingService.calculateSessionPrice(
            effectiveBase, expertTier, grade, deliveryMode, classType
        );
        int totalSessions = sessionsPerMonth * termMonths;
        BigDecimal grossAmount = unitSessionPrice.multiply(BigDecimal.valueOf(totalSessions));
        BigDecimal discountRate = pricingService.getCommitmentDiscountRate(termMonths);
        BigDecimal netTermAmount = pricingService.calculateTermTotal(
            unitSessionPrice, sessionsPerMonth, termMonths
        );
        BigDecimal multiplier = pricingService.getExpertTierMultiplier(expertTier)
            .multiply(pricingService.getGradeMultiplier(grade))
            .multiply(pricingService.getDeliveryModeMultiplier(deliveryMode))
            .multiply(pricingService.getClassTypeMultiplier(classType))
            .setScale(2, RoundingMode.HALF_UP);

        Map<String, Object> payload = new HashMap<>();
        payload.put("basePriceVnd", effectiveBase);
        payload.put("combinedMultiplier", multiplier);
        payload.put("unitSessionPriceVnd", unitSessionPrice);
        payload.put("totalSessionsInTerm", totalSessions);
        payload.put("grossAmountVnd", grossAmount);
        payload.put("discountPercent", discountRate.multiply(new BigDecimal("100")).intValue());
        payload.put("discountAmountVnd", grossAmount.subtract(netTermAmount));
        payload.put("netPayableVnd", netTermAmount);
        payload.put("refundGuaranteeDays", 14);
        return ResponseEntity.ok(payload);
    }

    @DoPost("/ecommerce/checkout-vietqr")
    public ResponseEntity createVietQrEcommerceOrder(@RequestBody Map<String, Object> req) {
        String packageCode = str(req, "packageCode", "PKG-T12-COACH");
        long studentId = num(req, "studentId", 1L);
        String parentName = str(req, "parentName", "");
        String parentPhone = str(req, "parentPhone", "");
        String studentName = str(req, "studentName", "");
        String voucherCode = str(req, "voucherCode", "");
        String referralCode = str(req, "referralCode", "");

        OylgEcommerceOrderWallet order = platformService.createVietQrOrder(
            packageCode, studentId, parentName, parentPhone, studentName, voucherCode, referralCode
        );
        OylgStudentProfile student = platformService.getStudentOrDefault(order.getStudentId());

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.getId());
        response.put("orderCode", order.getOrderCode());
        response.put("packageTitle", order.getPackageTitle());
        response.put("paymentMethod", order.getPaymentChannel());
        response.put("paymentStatus", order.getPaymentStatus());
        response.put("netPaidAmountVnd", order.getNetPaidAmountVnd());
        response.put("sessionsGranted", order.getTotalSessionsGranted());
        response.put("walletBalance", student != null ? student.getSessionCreditsRemaining() : 0);
        response.put("dthhCommissionBaseVnd", order.getDthhBaseVnd());
        response.put("unlockedTier1RepCommissionVnd", order.getRepCommissionVnd());
        response.put("unlockedTier2LeaderCommissionVnd", order.getLeaderCommissionVnd());
        return ResponseEntity.ok(response);
    }

    @DoPost("/orders/{orderId}/refund-14d")
    public ResponseEntity refundOrder14d(@PathVariable("orderId") long orderId) {
        OylgEcommerceOrderWallet order = platformService.refundOrderWithin14Days(orderId);
        Map<String, Object> res = new HashMap<>();
        if (order == null) {
            res.put("ok", false);
            return ResponseEntity.badRequest(res);
        }
        OylgStudentProfile st = platformService.getStudentOrDefault(order.getStudentId());
        res.put("ok", true);
        res.put("orderCode", order.getOrderCode());
        res.put("status", order.getPaymentStatus());
        res.put("refundedAmountVnd", order.getRefundedAmountVnd());
        res.put("walletBalance", st != null ? st.getSessionCreditsRemaining() : 0);
        return ResponseEntity.ok(res);
    }

    @DoPost("/lessons/{lessonId}/reschedule")
    public ResponseEntity rescheduleLesson(
        @PathVariable("lessonId") long lessonId,
        @RequestBody Map<String, Object> req
    ) {
        String scheduleLabel = str(req, "scheduleLabel", "Thứ Bảy, 14:00 – 15:30");
        OylgLessonRecord rec = platformService.rescheduleLesson(lessonId, scheduleLabel);
        Map<String, Object> res = new HashMap<>();
        res.put("ok", rec != null);
        if (rec != null) {
            res.put("lessonId", rec.getId());
            res.put("scheduleLabel", rec.getScheduleLabel());
        }
        return ResponseEntity.ok(res);
    }

    @DoPost("/lessons/{lessonId}/switch-mode")
    public ResponseEntity switchLessonMode(
        @PathVariable("lessonId") long lessonId,
        @RequestBody Map<String, Object> req
    ) {
        String deliveryMode = str(req, "deliveryMode", "AT_CENTER");
        OylgLessonRecord rec = platformService.switchLessonModality(lessonId, deliveryMode);
        Map<String, Object> res = new HashMap<>();
        res.put("ok", rec != null);
        if (rec != null) {
            res.put("lessonId", rec.getId());
            res.put("deliveryMode", rec.getDeliveryMode());
            res.put("roomOrLink", rec.getRoomOrLink());
            res.put("sessionPriceVnd", rec.getSessionPrice());
        }
        return ResponseEntity.ok(res);
    }

    @DoPost("/lessons/preview-dlp")
    public ResponseEntity previewGuardrail(@RequestBody Map<String, Object> req) {
        String raw = str(req, "rawText", "");
        OylgGuardrailService.GuardrailResult gr = guardrailService.inspectAndSanitize(raw);
        Map<String, Object> res = new HashMap<>();
        res.put("sanitizedText", gr.getSanitizedText());
        res.put("maskedCount", gr.getMaskedCount());
        res.put("redSafetyTriggered", gr.isRedSafetyTriggered());
        res.put("hotline", "111 / 115");
        return ResponseEntity.ok(res);
    }

    @DoPost("/lessons/log")
    public ResponseEntity submitLessonLog(@RequestBody Map<String, Object> req) {
        long studentId = num(req, "studentId", 1L);
        String unitCode = str(req, "unitCode", "TOAN.08.HDT.01");
        String understanding = str(req, "understandingLevel", "MASTERED");
        String mood = str(req, "moodObserved", "Tập trung cao");
        int focus = (int) num(req, "focusScore", 5L);
        String rawNotes = str(req, "rawTutorNotes", "");
        String internalNotes = str(req, "internalNotes", "");
        return ResponseEntity.ok(
            platformService.submitStructuredLessonLog(
                studentId, unitCode, understanding, mood, focus, rawNotes, internalNotes
            )
        );
    }

    @DoPost("/students/{studentId}/progress")
    public ResponseEntity updateStudentProgress(
        @PathVariable("studentId") long studentId,
        @RequestBody Map<String, Object> req
    ) {
        int deltaXp = (int) num(req, "deltaXp", 0L);
        String mood = str(req, "moodStatus", "");
        OylgStudentProfile st = platformService.addStudentXpAndMood(studentId, deltaXp, mood);
        Map<String, Object> res = new HashMap<>();
        res.put("ok", st != null);
        if (st != null) {
            res.put("xpPoints", st.getXpPoints());
            res.put("moodStatus", st.getMoodStatus());
        }
        return ResponseEntity.ok(res);
    }

    @DoPost("/leads")
    public ResponseEntity submitConsultationLead(@RequestBody Map<String, Object> req) {
        OylgConsultationLead lead = platformService.createConsultationLead(
            str(req, "parentName", "Phụ huynh OYLG"),
            str(req, "phone", ""),
            str(req, "studentName", "Học sinh"),
            (int) num(req, "grade", 9L),
            str(req, "serviceInterest", ""),
            str(req, "assignedExpert", "ThS. Lê Minh Tâm"),
            str(req, "referralCode", "")
        );
        Map<String, Object> res = new HashMap<>();
        res.put("ok", true);
        res.put("leadId", lead.getId());
        res.put("assignedExpert", lead.getAssignedExpert());
        return ResponseEntity.ok(res);
    }

    @DoPost("/leads/{leadId}/advance")
    public ResponseEntity advanceLead(@PathVariable("leadId") long leadId) {
        OylgConsultationLead lead = platformService.advanceLeadStage(leadId);
        Map<String, Object> res = new HashMap<>();
        res.put("ok", lead != null);
        if (lead != null) {
            res.put("stage", lead.getStage());
        }
        return ResponseEntity.ok(res);
    }

    @DoPost("/commission/simulate")
    public ResponseEntity simulateCommission(@RequestBody Map<String, Object> req) {
        BigDecimal firstPayment = new BigDecimal(str(req, "firstPaymentVnd", "4000000"));
        BigDecimal sixMonthVal = new BigDecimal(str(req, "sixMonthValueVnd", "24000000"));
        int collectedPeriods = (int) num(req, "collectedPeriods", 6L);
        int totalPeriods = Math.max(1, (int) num(req, "totalPeriods", 6L));
        boolean isLeaderDirect = Boolean.parseBoolean(str(req, "isDirectByLeader", "false"));
        boolean isCareUpsell = Boolean.parseBoolean(str(req, "isCareUpsell", "false"));

        BigDecimal dthh = commissionService.calculateCommissionBaseDthh(firstPayment, sixMonthVal);
        BigDecimal collected = dthh
            .multiply(BigDecimal.valueOf(collectedPeriods))
            .divide(BigDecimal.valueOf(totalPeriods), 0, RoundingMode.HALF_UP);
        OylgCommissionService.CommissionSplit fullSplit =
            commissionService.calculatePayAsCollectedSplit(
                firstPayment, sixMonthVal, dthh, false, isCareUpsell, isLeaderDirect
            );
        OylgCommissionService.CommissionSplit unlockedSplit =
            commissionService.calculatePayAsCollectedSplit(
                firstPayment, sixMonthVal, collected, false, isCareUpsell, isLeaderDirect
            );

        BigDecimal fullTotal = fullSplit.getUnlockedRepAmount().add(fullSplit.getUnlockedLeaderAmount());
        BigDecimal unlockedTotal = unlockedSplit.getUnlockedRepAmount().add(unlockedSplit.getUnlockedLeaderAmount());

        Map<String, Object> res = new HashMap<>();
        res.put("dthhBaseVnd", dthh);
        res.put("totalEntitledVnd", fullTotal);
        res.put("repEntitledVnd", fullSplit.getUnlockedRepAmount());
        res.put("leaderEntitledVnd", fullSplit.getUnlockedLeaderAmount());
        res.put("unlockedPayableVnd", unlockedTotal);
        res.put("cancelledUncollectedVnd", fullTotal.subtract(unlockedTotal));
        return ResponseEntity.ok(res);
    }

    @DoPost("/boarding/verify-pickup")
    public ResponseEntity verifyPickup(@RequestBody Map<String, Object> req) {
        long pickupId = num(req, "pickupId", 1L);
        return ResponseEntity.ok(platformService.verifyBoardingPickupQr(pickupId));
    }

    @DoPost("/settings/base-price")
    public ResponseEntity updateBasePrice(@RequestBody Map<String, Object> req) {
        long newPrice = num(req, "basePriceVnd", 200000L);
        pricingService.setBaseSessionPrice(newPrice);
        Map<String, Object> res = new HashMap<>();
        res.put("ok", true);
        res.put("basePriceVnd", pricingService.getBaseSessionPrice());
        return ResponseEntity.ok(res);
    }

    @DoPost("/group-classes/{groupId}/action")
    public ResponseEntity groupClassAction(
        @PathVariable("groupId") long groupId,
        @RequestBody Map<String, Object> req
    ) {
        OylgGroupClass gc = platformService.updateGroupClassAction(
            groupId, str(req, "action", "ACTIVATE")
        );
        Map<String, Object> res = new HashMap<>();
        res.put("ok", gc != null);
        if (gc != null) {
            res.put("status", gc.getStatus());
            res.put("enrolledCount", gc.getEnrolledCount());
        }
        return ResponseEntity.ok(res);
    }

    @DoPost("/questions/{questionId}/review")
    public ResponseEntity reviewQuestion(
        @PathVariable("questionId") long questionId,
        @RequestBody Map<String, Object> req
    ) {
        OylgQuestionItem q = platformService.reviewQuestion(
            questionId, str(req, "status", "APPROVED")
        );
        Map<String, Object> res = new HashMap<>();
        res.put("ok", q != null);
        if (q != null) {
            res.put("approvalStatus", q.getApprovalStatus());
        }
        return ResponseEntity.ok(res);
    }

    @DoPost("/questions/generate")
    public ResponseEntity generateQuestion(@RequestBody Map<String, Object> req) {
        OylgQuestionItem q = platformService.generateQuestionDraft(
            str(req, "subjectLabel", "Toán Lớp 9"),
            str(req, "unitCode", "TOAN.09.CBH.02"),
            str(req, "diagnosticGoal", "")
        );
        Map<String, Object> res = new HashMap<>();
        res.put("ok", true);
        res.put("questionCode", q.getQuestionCode());
        return ResponseEntity.ok(res);
    }

    private String str(Map<String, Object> map, String key, String def) {
        if (map == null || !map.containsKey(key) || map.get(key) == null) {
            return def;
        }
        return String.valueOf(map.get(key));
    }

    private long num(Map<String, Object> map, String key, long def) {
        try {
            if (map == null || !map.containsKey(key) || map.get(key) == null) {
                return def;
            }
            return Long.parseLong(String.valueOf(map.get(key)).replaceAll("[^0-9\\-]", ""));
        } catch (Exception e) {
            return def;
        }
    }
}
