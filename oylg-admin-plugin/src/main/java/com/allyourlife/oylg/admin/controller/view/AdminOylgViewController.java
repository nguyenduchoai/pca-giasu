package com.allyourlife.oylg.admin.controller.view;

import com.allyourlife.oylg.service.OylgPlatformService;
import com.allyourlife.oylg.service.OylgPricingService;
import com.allyourlife.oylg.service.OylgSecurityAndLedgerService;
import com.tvd12.ezyhttp.server.core.annotation.Authenticated;
import com.tvd12.ezyhttp.server.core.annotation.Controller;
import com.tvd12.ezyhttp.server.core.annotation.DoGet;
import com.tvd12.ezyhttp.server.core.view.View;

@Authenticated
@Controller("/oylg")
public class AdminOylgViewController {

    private final OylgPricingService pricingService;
    private final OylgPlatformService platformService;
    private final OylgSecurityAndLedgerService securityAndLedgerService;

    public AdminOylgViewController(
        OylgPricingService pricingService,
        OylgPlatformService platformService,
        OylgSecurityAndLedgerService securityAndLedgerService
    ) {
        this.pricingService = pricingService;
        this.platformService = platformService;
        this.securityAndLedgerService = securityAndLedgerService;
    }

    @DoGet("")
    public View indexGet() {
        return buildAdminView("dashboard", "Trung tâm Điều hành OYLG");
    }

    @DoGet("/")
    public View rootGet() {
        return buildAdminView("dashboard", "Trung tâm Điều hành OYLG");
    }

    @DoGet("/dashboard")
    public View dashboardGet() {
        return buildAdminView("dashboard", "Trung tâm Điều hành OYLG");
    }

    @DoGet("/cases")
    public View casesGet() {
        return buildAdminView("cases", "Hồ sơ Đồng hành 3 Tầng & Ví Buổi Học");
    }

    @DoGet("/content-approvals")
    public View contentApprovalsGet() {
        return buildAdminView("content_approvals", "Phê duyệt Ngân hàng Câu hỏi B1–B4");
    }

    @DoGet("/curriculum-graph")
    public View curriculumGraphGet() {
        return buildAdminView("curriculum_graph", "Đồ thị Tiên quyết YCCĐ (GDPT 2018)");
    }

    @DoGet("/safety-alerts")
    public View safetyAlertsGet() {
        return buildAdminView("safety_alerts", "Cảnh báo An toàn Tâm lý M14 (111 / 115)");
    }

    @DoGet("/pricing-payouts")
    public View pricingPayoutsGet() {
        return buildAdminView("pricing_payouts", "Ma trận Giá Hệ số B6 & Gói Dịch vụ");
    }

    @DoGet("/commissions")
    public View commissionsGet() {
        return buildAdminView("commissions", "Đơn hàng VietQR, Sổ cái Ví & Hoa hồng 2 Cấp");
    }

    @DoGet("/boarding")
    public View boardingGet() {
        return buildAdminView("boarding", "Nội trú, Bán trú & Mã TOTP 60s (M21)");
    }

    @DoGet("/boarding-care")
    public View boardingCareGet() {
        return buildAdminView("boarding", "Nội trú, Bán trú & Mã TOTP 60s (M21)");
    }

    @DoGet("/settings")
    public View settingsGet() {
        return buildAdminView("settings", "Cấu hình Hệ thống & Phân quyền Tài khoản");
    }

    private View buildAdminView(String menuKey, String sectionTitle) {
        return View.builder()
            .template("oylg/dashboard")
            .addVariable("currentMenu", menuKey)
            .addVariable("pageTitle", sectionTitle)
            .addVariable("sectionTitle", sectionTitle)
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .addVariable("students", platformService.getAllStudents())
            .addVariable("cases", platformService.getAllCases())
            .addVariable("packages", platformService.getActivePackages())
            .addVariable("orders", platformService.getOrders(null))
            .addVariable("walletLedger", securityAndLedgerService.getWalletLedger(null))
            .addVariable("portalAccounts", securityAndLedgerService.getAllPortalAccounts())
            .addVariable("digestLogs", securityAndLedgerService.getDigestDispatches())
            .addVariable("liveTotpMap", securityAndLedgerService.getLivePickupTotpMap(1L))
            .addVariable("leads", platformService.getAllLeads())
            .addVariable("questions", platformService.getAllQuestions())
            .addVariable("groupClasses", platformService.getAllGroupClasses())
            .addVariable("heatmapUnits", platformService.getStudentHeatmapView(1L))
            .addVariable("safetyFlags", platformService.getAllSafetyFlags())
            .addVariable("residencies", platformService.getAllResidencies())
            .addVariable("pickups", platformService.getPickupsForStudent(1L))
            .addVariable("checkins", platformService.getRecentCheckins(null))
            .build();
    }
}
