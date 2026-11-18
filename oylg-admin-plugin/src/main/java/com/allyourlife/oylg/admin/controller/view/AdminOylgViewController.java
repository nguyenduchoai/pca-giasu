package com.allyourlife.oylg.admin.controller.view;

import com.allyourlife.oylg.admin.service.AdminOylgSettingService;
import com.allyourlife.oylg.service.OylgPlatformService;
import com.allyourlife.oylg.service.OylgPricingService;
import com.allyourlife.oylg.service.OylgSecurityAndLedgerService;
import com.tvd12.ezyfox.annotation.EzyFeature;
import com.tvd12.ezyhttp.server.core.annotation.Authenticated;
import com.tvd12.ezyhttp.server.core.annotation.Controller;
import com.tvd12.ezyhttp.server.core.annotation.DoGet;
import com.tvd12.ezyhttp.server.core.view.Redirect;
import com.tvd12.ezyhttp.server.core.view.View;

@Authenticated
@EzyFeature("oylg")
@Controller
public class AdminOylgViewController {

    private final OylgPricingService pricingService;
    private final OylgPlatformService platformService;
    private final OylgSecurityAndLedgerService securityAndLedgerService;
    private final AdminOylgSettingService settingService;

    public AdminOylgViewController(
        OylgPricingService pricingService,
        OylgPlatformService platformService,
        OylgSecurityAndLedgerService securityAndLedgerService,
        AdminOylgSettingService settingService
    ) {
        this.pricingService = pricingService;
        this.platformService = platformService;
        this.securityAndLedgerService = securityAndLedgerService;
        this.settingService = settingService;
    }

    @DoGet("/dashboard")
    public View dashboardGet() {
        return baseAdminView("oylg/dashboard", "dashboard", "oylg.dashboard.title")
            .addVariable("cases", platformService.getAllCases())
            .addVariable("orders", platformService.getOrders(null))
            .addVariable("leads", platformService.getAllLeads())
            .addVariable("safetyFlags", platformService.getAllSafetyFlags())
            .build();
    }

    @DoGet("/cases")
    public View casesGet() {
        return baseAdminView("oylg/cases", "cases", "oylg.cases.title")
            .addVariable("students", platformService.getAllStudents())
            .addVariable("cases", platformService.getAllCases())
            .addVariable("heatmapUnits", platformService.getStudentHeatmapView(1L))
            .build();
    }

    @DoGet("/orders")
    public View ordersGet() {
        return baseAdminView("oylg/orders", "orders", "oylg.orders.title")
            .addVariable("packages", platformService.getActivePackages())
            .addVariable("orders", platformService.getOrders(null))
            .addVariable("walletLedger", securityAndLedgerService.getWalletLedger(null))
            .addVariable("groupClasses", platformService.getAllGroupClasses())
            .build();
    }

    @DoGet("/commissions")
    public Redirect commissionsRedirect() {
        return Redirect.to("/oylg/orders");
    }

    @DoGet("/questions")
    public View questionsGet() {
        return baseAdminView("oylg/questions", "questions", "oylg.questions.title")
            .addVariable("questions", platformService.getAllQuestions())
            .build();
    }

    @DoGet("/content-approvals")
    public Redirect contentApprovalsRedirect() {
        return Redirect.to("/oylg/questions");
    }

    @DoGet("/boarding")
    public View boardingGet() {
        return baseAdminView("oylg/boarding", "boarding", "oylg.boarding.title")
            .addVariable("residencies", platformService.getAllResidencies())
            .addVariable("safetyFlags", platformService.getAllSafetyFlags())
            .addVariable("pickups", platformService.getPickupsForStudent(1L))
            .addVariable("liveTotpMap", securityAndLedgerService.getLivePickupTotpMap(1L))
            .addVariable("checkins", platformService.getRecentCheckins(null))
            .build();
    }

    @DoGet("/settings")
    public View settingsGet() {
        return baseAdminView("oylg/settings", "settings", "oylg.settings.title")
            .addVariable("portalAccounts", securityAndLedgerService.getAllPortalAccounts())
            .build();
    }

    private View.Builder baseAdminView(
        String template,
        String menuKey,
        String pageTitleKey
    ) {
        return View.builder()
            .template(template)
            .addVariable("currentOpen", "oylg")
            .addVariable("currentMenu", menuKey)
            .addVariable("pageTitle", pageTitleKey)
            .addVariable("settings", settingService.getSettings())
            .addVariable("webUrl", settingService.getWebUrl())
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice());
    }
}
