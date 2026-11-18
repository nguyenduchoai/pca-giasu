package com.allyourlife.oylg.service;

import com.allyourlife.oylg.entity.OylgAuthorizedPickup;
import com.allyourlife.oylg.entity.OylgDigestDispatch;
import com.allyourlife.oylg.entity.OylgEcommerceOrderWallet;
import com.allyourlife.oylg.entity.OylgLessonRecord;
import com.allyourlife.oylg.entity.OylgPortalAccount;
import com.allyourlife.oylg.entity.OylgServicePackage;
import com.allyourlife.oylg.entity.OylgStudentProfile;
import com.allyourlife.oylg.entity.OylgWalletTransaction;
import com.allyourlife.oylg.repository.OylgAuthorizedPickupRepository;
import com.allyourlife.oylg.repository.OylgDigestDispatchRepository;
import com.allyourlife.oylg.repository.OylgEcommerceOrderWalletRepository;
import com.allyourlife.oylg.repository.OylgPortalAccountRepository;
import com.allyourlife.oylg.repository.OylgServicePackageRepository;
import com.allyourlife.oylg.repository.OylgStudentProfileRepository;
import com.allyourlife.oylg.repository.OylgWalletTransactionRepository;
import com.tvd12.ezyfox.bean.annotation.EzyAutoBind;
import com.tvd12.ezyfox.bean.annotation.EzySingleton;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@EzySingleton
public class OylgSecurityAndLedgerService {

    public static final String SESSION_COOKIE_NAME = "oylg_session";

    @EzyAutoBind
    private OylgPortalAccountRepository accountRepo;
    @EzyAutoBind
    private OylgWalletTransactionRepository ledgerRepo;
    @EzyAutoBind
    private OylgDigestDispatchRepository digestRepo;
    @EzyAutoBind
    private OylgStudentProfileRepository studentRepo;
    @EzyAutoBind
    private OylgServicePackageRepository packageRepo;
    @EzyAutoBind
    private OylgEcommerceOrderWalletRepository orderRepo;
    @EzyAutoBind
    private OylgAuthorizedPickupRepository pickupRepo;
    @EzyAutoBind
    private OylgPlatformService platformService;
    @EzyAutoBind
    private OylgCommissionService commissionService;

    private volatile boolean seeded = false;

    public synchronized void ensureSeeded() {
        platformService.ensureSeeded();
        if (seeded) {
            return;
        }
        if (accountRepo.count() > 0) {
            seeded = true;
            return;
        }
        LocalDateTime now = LocalDateTime.now();
        String defaultHash = sha256("oylg2026");

        saveAccount("0905123489", defaultHash, "Chị Nguyễn Thị Lan", "PARENT", "Phụ huynh đồng hành", "/parent", 1L, now);
        saveAccount("0905000089", defaultHash, "Nguyễn Minh Khôi", "STUDENT", "Học sinh Lớp 9", "/student", 1L, now);
        saveAccount("0905888002", defaultHash, "ThS. Lê Minh Tâm", "COACH", "Cố vấn Cuộc sống", "/coach", 0L, now);
        saveAccount("0905888003", defaultHash, "Thầy Đặng Quốc Việt", "TUTOR", "Gia sư Bộ môn Toán", "/coach/sessions", 0L, now);
        saveAccount("0905888004", defaultHash, "Phạm Hoàng Minh", "SALES", "Trưởng nhóm Tuyển sinh", "/operations/sales", 0L, now);
        saveAccount("0905888005", defaultHash, "Thầy Vũ Hải Nam", "BOARDING", "Quản sinh Nội trú", "/operations/boarding", 0L, now);
        saveAccount("0905888001", defaultHash, "Cố vấn Tracie Anh", "STUDIO", "Chủ tịch Hội đồng Chuyên môn", "/studio", 0L, now);
        saveAccount("0905999999", defaultHash, "Ban Điều hành OYLG", "ADMIN", "Quản trị viên Hệ thống", "/admin", 0L, now);

        // Initial Double-Entry Wallet Ledger
        recordLedger(1L, "Nguyễn Minh Khôi", "TX-2026-0001", "CREDIT_ORDER", 48,
            new BigDecimal("13980000"), 20, "ORD-2026-1089",
            "Webhook VietQR xác nhận gói Đồng hành Chuyên gia Bộ môn (48 buổi)", now.minusDays(5));
        recordLedger(1L, "Nguyễn Minh Khôi", "TX-2026-0002", "DEBIT_LESSON", -2,
            new BigDecimal("-768000"), 18, "TOAN.08.HDT.01",
            "Hoàn thành 2 buổi kèm 1-1 Toán Lớp 9 tại Trung tâm (đã nộp biên bản 60s)", now.minusDays(2));
        recordLedger(2L, "Trần Bảo Ngọc", "TX-2026-0003", "CREDIT_ORDER", 12,
            new BigDecimal("4500000"), 14, "ORD-2026-1104",
            "Webhook VietQR xác nhận gói Hướng nghiệp + Tầm soát 3 mặt (12 buổi)", now.minusDays(3));

        // Initial Evening Digest Log
        OylgDigestDispatch d1 = new OylgDigestDispatch();
        d1.setStudentId(1L);
        d1.setStudentName("Nguyễn Minh Khôi");
        d1.setParentPhone("0905123489");
        d1.setChannel("ZALO_ZNS");
        d1.setDigestDate(LocalDate.now().minusDays(1).toString());
        d1.setSummaryContent("Bản tin 20:30: Khôi đến khu Bán trú lúc 11:40, ăn trưa thực đơn riêng chống dị ứng và nắm vững 3 hằng đẳng thức Toán Lớp 8.");
        d1.setDispatchStatus("SENT");
        d1.setSentAt(now.minusHours(16));
        digestRepo.save(d1);

        seeded = true;
    }

    public List<OylgPortalAccount> getAllPortalAccounts() {
        ensureSeeded();
        List<OylgPortalAccount> list = accountRepo.findAll();
        list.sort(Comparator.comparingLong(OylgPortalAccount::getId));
        return list;
    }

    public OylgPortalAccount authenticate(String phone, String password) {
        ensureSeeded();
        if (phone == null || password == null) {
            return null;
        }
        OylgPortalAccount acc = accountRepo.findByPhone(phone.trim());
        if (acc == null) {
            return null;
        }
        if (!acc.getPasswordHash().equals(sha256(password.trim()))) {
            return null;
        }
        String token = UUID.randomUUID().toString().replace("-", "");
        acc.setSessionToken(token);
        acc.setUpdatedAt(LocalDateTime.now());
        accountRepo.save(acc);
        return acc;
    }

    public OylgPortalAccount getAccountByToken(String token) {
        ensureSeeded();
        if (token == null || token.trim().isEmpty()) {
            return null;
        }
        return accountRepo.findBySessionToken(token.trim());
    }

    public void logoutToken(String token) {
        OylgPortalAccount acc = getAccountByToken(token);
        if (acc != null) {
            acc.setSessionToken("");
            acc.setUpdatedAt(LocalDateTime.now());
            accountRepo.save(acc);
        }
    }

    public boolean canAccessPortal(OylgPortalAccount acc, String portalGroup) {
        if (acc == null) {
            return false;
        }
        String role = acc.getRoleCode();
        if ("ADMIN".equals(role)) {
            return true;
        }
        if ("parent".equals(portalGroup)) {
            return "PARENT".equals(role);
        }
        if ("student".equals(portalGroup)) {
            return "STUDENT".equals(role) || "PARENT".equals(role);
        }
        if ("coach".equals(portalGroup)) {
            return "COACH".equals(role) || "TUTOR".equals(role) || "STUDIO".equals(role);
        }
        if ("sales".equals(portalGroup)) {
            return "SALES".equals(role);
        }
        if ("boarding".equals(portalGroup)) {
            return "BOARDING".equals(role) || "COACH".equals(role);
        }
        if ("studio".equals(portalGroup)) {
            return "STUDIO".equals(role) || "COACH".equals(role);
        }
        return false;
    }

    // ==================== 2-STEP VIETQR PENDING -> WEBHOOK PAID + LEDGER ====================

    public OylgEcommerceOrderWallet createPendingVietQrOrder(
        String packageCode,
        long studentId,
        String parentName,
        String parentPhone,
        String studentName,
        String voucherCode,
        String referralCode
    ) {
        ensureSeeded();
        OylgServicePackage pkg = packageRepo.findByPackageCode(packageCode);
        if (pkg == null) {
            pkg = platformService.getActivePackages().get(0);
        }
        OylgStudentProfile student = platformService.getStudentOrDefault(studentId);
        BigDecimal subtotal = pkg.getNetPriceVnd();
        BigDecimal discount = BigDecimal.ZERO;
        if (voucherCode != null && "OYLG2026".equalsIgnoreCase(voucherCode.trim())) {
            discount = new BigDecimal("200000");
        }
        BigDecimal netPayable = subtotal.subtract(discount).max(BigDecimal.ZERO);
        BigDecimal sixMonthRef = pkg.getSixMonthReferenceVnd().max(netPayable);

        OylgCommissionService.CommissionSplit split =
            commissionService.calculatePayAsCollectedSplit(
                netPayable, sixMonthRef, BigDecimal.ZERO, false, false, false
            );

        LocalDateTime now = LocalDateTime.now();
        String orderCode = "ORD-2026-" + (1100 + orderRepo.count() + 1);
        OylgEcommerceOrderWallet order = new OylgEcommerceOrderWallet();
        order.setOrderCode(orderCode);
        order.setStudentId(student != null ? student.getId() : 1L);
        order.setParentName(parentName != null && !parentName.trim().isEmpty()
            ? parentName.trim() : (student != null ? student.getParentName() : "Phụ huynh OYLG"));
        order.setParentPhone(parentPhone != null && !parentPhone.trim().isEmpty()
            ? parentPhone.trim() : (student != null ? student.getParentPhone() : "0905123489"));
        order.setStudentName(studentName != null && !studentName.trim().isEmpty()
            ? studentName.trim() : (student != null ? student.getFullName() : "Nguyễn Minh Khôi"));
        order.setPackageTitle(pkg.getTitle());
        order.setVoucherCode(voucherCode != null ? voucherCode.trim().toUpperCase() : "");
        order.setReferralCode(referralCode != null ? referralCode.trim().toUpperCase() : "");
        order.setSubtotalAmountVnd(subtotal);
        order.setDiscountAmountVnd(discount);
        order.setNetPaidAmountVnd(netPayable);
        order.setDthhBaseVnd(split.getDthhBase());
        order.setRepCommissionVnd(BigDecimal.ZERO);
        order.setLeaderCommissionVnd(BigDecimal.ZERO);
        order.setTotalSessionsGranted(pkg.getSessionCreditsGranted());
        order.setConsumedSessionsCount(0);
        order.setPaymentChannel("VIETQR_WEBHOOK");
        order.setPaymentStatus("PENDING_PAYMENT");
        order.setRefundGuaranteedUntil(now.plusDays(14));
        order.setRefundedAmountVnd(BigDecimal.ZERO);
        order.setCreatedAt(now);
        order.setUpdatedAt(now);
        orderRepo.save(order);
        return order;
    }

    public synchronized Map<String, Object> processBankPaymentWebhook(String orderCode, BigDecimal paidAmount) {
        ensureSeeded();
        Map<String, Object> res = new HashMap<>();
        OylgEcommerceOrderWallet order = orderRepo.findByOrderCode(orderCode);
        if (order == null) {
            res.put("ok", false);
            res.put("message", "Không tìm thấy mã đơn hàng " + orderCode);
            return res;
        }
        if ("PAID".equals(order.getPaymentStatus())) {
            OylgStudentProfile existingSt = platformService.getStudentOrDefault(order.getStudentId());
            res.put("ok", true);
            res.put("idempotent", true);
            res.put("orderCode", order.getOrderCode());
            res.put("walletBalance", existingSt != null ? existingSt.getSessionCreditsRemaining() : 0);
            return res;
        }

        BigDecimal actualPaid = (paidAmount != null && paidAmount.compareTo(BigDecimal.ZERO) > 0)
            ? paidAmount
            : order.getNetPaidAmountVnd();
        OylgCommissionService.CommissionSplit split =
            commissionService.calculatePayAsCollectedSplit(
                actualPaid, order.getDthhBaseVnd().max(actualPaid), actualPaid, false, false, false
            );

        LocalDateTime now = LocalDateTime.now();
        order.setPaymentStatus("PAID");
        order.setNetPaidAmountVnd(actualPaid);
        order.setRepCommissionVnd(split.getUnlockedRepAmount());
        order.setLeaderCommissionVnd(split.getUnlockedLeaderAmount());
        order.setRefundGuaranteedUntil(now.plusDays(14));
        order.setUpdatedAt(now);
        orderRepo.save(order);

        OylgStudentProfile student = studentRepo.findById(order.getStudentId());
        int newBalance = 0;
        if (student != null) {
            newBalance = student.getSessionCreditsRemaining() + order.getTotalSessionsGranted();
            student.setSessionCreditsRemaining(newBalance);
            student.setUpdatedAt(now);
            studentRepo.save(student);

            recordLedger(
                student.getId(),
                student.getFullName(),
                "TX-2026-" + (1000 + ledgerRepo.count() + 1),
                "CREDIT_ORDER",
                order.getTotalSessionsGranted(),
                actualPaid,
                newBalance,
                order.getOrderCode(),
                "Webhook Ngân hàng đối soát tự động · Cộng +" + order.getTotalSessionsGranted() + " buổi",
                now
            );
        }

        res.put("ok", true);
        res.put("orderCode", order.getOrderCode());
        res.put("paymentStatus", order.getPaymentStatus());
        res.put("netPaidAmountVnd", actualPaid);
        res.put("sessionsGranted", order.getTotalSessionsGranted());
        res.put("walletBalance", newBalance);
        res.put("repCommissionVnd", order.getRepCommissionVnd());
        res.put("leaderCommissionVnd", order.getLeaderCommissionVnd());
        return res;
    }

    public void appendRefundLedger(OylgEcommerceOrderWallet order, int deductedSessions) {
        if (order == null) {
            return;
        }
        OylgStudentProfile st = studentRepo.findById(order.getStudentId());
        int balance = st != null ? st.getSessionCreditsRemaining() : 0;
        recordLedger(
            order.getStudentId(),
            order.getStudentName(),
            "TX-2026-" + (1000 + ledgerRepo.count() + 1),
            "REFUND_14D",
            -deductedSessions,
            order.getRefundedAmountVnd().negate(),
            balance,
            order.getOrderCode(),
            "Bảo lãnh hoàn học phí 14 ngày · Thu hồi buổi chưa dùng & hủy hoa hồng tạm giữ",
            LocalDateTime.now()
        );
    }

    public List<OylgWalletTransaction> getWalletLedger(Long studentId) {
        ensureSeeded();
        List<OylgWalletTransaction> list = studentId != null && studentId > 0
            ? ledgerRepo.findByStudentId(studentId)
            : ledgerRepo.findAll();
        list.sort((a, b) -> Long.compare(b.getId(), a.getId()));
        return list;
    }

    public List<OylgDigestDispatch> getDigestDispatches() {
        ensureSeeded();
        List<OylgDigestDispatch> list = digestRepo.findAll();
        list.sort((a, b) -> Long.compare(b.getId(), a.getId()));
        return list;
    }

    public OylgDigestDispatch dispatchEveningDigest(long studentId) {
        ensureSeeded();
        OylgStudentProfile st = platformService.getStudentOrDefault(studentId);
        List<OylgLessonRecord> logs = platformService.getCompletedLessonLogs(st.getId());
        String latestSummary = logs.isEmpty()
            ? "Con hoàn thành đầy đủ kế hoạch tự học 60/40 trong ngày."
            : logs.get(0).getSanitizedParentSummary();

        OylgDigestDispatch d = new OylgDigestDispatch();
        d.setStudentId(st.getId());
        d.setStudentName(st.getFullName());
        d.setParentPhone(st.getParentPhone());
        d.setChannel("ZALO_ZNS + EMAIL");
        d.setDigestDate(LocalDate.now().toString());
        d.setSummaryContent("Bản tin tổng hợp 20:30 (" + st.getFullName() + "): " + latestSummary);
        d.setDispatchStatus("SENT");
        d.setSentAt(LocalDateTime.now());
        digestRepo.save(d);
        return d;
    }

    // ==================== 60-SECOND ROTATING TOTP PICKUP QR ====================

    public String computePickupTotp60s(String qrPassToken) {
        try {
            long minuteBucket = System.currentTimeMillis() / 60000L;
            String msg = (qrPassToken != null ? qrPassToken : "OYLG") + ":" + minuteBucket;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec("OYLG-M21-PICKUP-SECRET".getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(msg.getBytes(StandardCharsets.UTF_8));
            int code = ((hash[0] & 0x7f) << 24 | (hash[1] & 0xff) << 16 | (hash[2] & 0xff) << 8 | (hash[3] & 0xff)) % 1000000;
            return String.format("%06d", code);
        } catch (Exception e) {
            return "482910";
        }
    }

    public Map<Long, String> getLivePickupTotpMap(long studentId) {
        ensureSeeded();
        List<OylgAuthorizedPickup> pickups = platformService.getPickupsForStudent(studentId);
        Map<Long, String> map = new HashMap<>();
        for (OylgAuthorizedPickup pk : pickups) {
            map.put(pk.getId(), pk.isAuthorized() ? computePickupTotp60s(pk.getQrPassToken()) : "KHÔNG HỢP LỆ");
        }
        return map;
    }

    private void saveAccount(
        String phone, String hash, String name, String roleCode, String roleLabel,
        String route, long studentId, LocalDateTime now
    ) {
        OylgPortalAccount a = new OylgPortalAccount();
        a.setPhone(phone);
        a.setPasswordHash(hash);
        a.setFullName(name);
        a.setRoleCode(roleCode);
        a.setRoleLabel(roleLabel);
        a.setDefaultRoute(route);
        a.setLinkedStudentId(studentId);
        a.setSessionToken("");
        a.setStatus("ACTIVE");
        a.setCreatedAt(now);
        a.setUpdatedAt(now);
        accountRepo.save(a);
    }

    public void recordLedger(
        long studentId, String studentName, String code, String type,
        int deltaSessions, BigDecimal deltaAmount, int balanceAfter,
        String ref, String desc, LocalDateTime at
    ) {
        OylgWalletTransaction tx = new OylgWalletTransaction();
        tx.setStudentId(studentId);
        tx.setStudentName(studentName);
        tx.setTxCode(code);
        tx.setTxType(type);
        tx.setDeltaSessions(deltaSessions);
        tx.setDeltaAmountVnd(deltaAmount);
        tx.setBalanceAfter(balanceAfter);
        tx.setReferenceCode(ref);
        tx.setDescription(desc);
        tx.setCreatedAt(at);
        ledgerRepo.save(tx);
    }

    private String sha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] out = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : out) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            return input;
        }
    }
}
