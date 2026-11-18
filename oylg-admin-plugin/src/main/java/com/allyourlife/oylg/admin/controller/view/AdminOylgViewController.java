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
        return buildAdminView("dashboard", "Tổng quan");
    }

    @DoGet("/")
    public View rootGet() {
        return buildAdminView("dashboard", "Tổng quan");
    }

    @DoGet("/dashboard")
    public View dashboardGet() {
        return buildAdminView("dashboard", "Tổng quan");
    }

    @DoGet("/cases")
    public View casesGet() {
        return buildAdminView("cases", "Học sinh");
    }

    @DoGet("/commissions")
    public View commissionsGet() {
        return buildAdminView("commissions", "Đơn hàng & Gói học");
    }

    @DoGet("/pricing-payouts")
    public View pricingPayoutsGet() {
        return buildAdminView("commissions", "Đơn hàng & Gói học");
    }

    @DoGet("/content-approvals")
    public View contentApprovalsGet() {
        return buildAdminView("content_approvals", "Ngân hàng đề");
    }

    @DoGet("/curriculum-graph")
    public View curriculumGraphGet() {
        return buildAdminView("cases", "Học sinh");
    }

    @DoGet("/boarding")
    public View boardingGet() {
        return buildAdminView("boarding", "Bán trú & An toàn");
    }

    @DoGet("/boarding-care")
    public View boardingCareGet() {
        return buildAdminView("boarding", "Bán trú & An toàn");
    }

    @DoGet("/safety-alerts")
    public View safetyAlertsGet() {
        return buildAdminView("boarding", "Bán trú & An toàn");
    }

    @DoGet("/settings")
    public View settingsGet() {
        return buildAdminView("settings", "Cài đặt");
    }

    private View buildAdminView(String menuKey, String sectionTitle) {
        return View.builder()
            .template("oylg/dashboard")
            .addVariable("currentOpen", "oylg")
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
            .addVariable("liveTotpMap", securityAndLedgerService.getLivePickupTotpMap(1L))
            .addVariable("questions", platformService.getAllQuestions())
            .addVariable("groupClasses", platformService.getAllGroupClasses())
            .addVariable("heatmapUnits", platformService.getStudentHeatmapView(1L))
            .addVariable("safetyFlags", platformService.getAllSafetyFlags())
            .addVariable("pickups", platformService.getPickupsForStudent(1L))
            .addVariable("checkins", platformService.getRecentCheckins(null))
            .build();
    }
}
