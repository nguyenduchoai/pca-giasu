package com.allyourlife.oylg.admin.controller.view;

import com.allyourlife.oylg.service.OylgPricingService;
import com.tvd12.ezyhttp.server.core.annotation.Authenticated;
import com.tvd12.ezyhttp.server.core.annotation.Controller;
import com.tvd12.ezyhttp.server.core.annotation.DoGet;
import com.tvd12.ezyhttp.server.core.view.View;

@Authenticated
@Controller("/oylg")
public class AdminOylgViewController {

    private final OylgPricingService pricingService;

    public AdminOylgViewController(OylgPricingService pricingService) {
        this.pricingService = pricingService;
    }

    @DoGet("")
    public View indexGet() {
        return dashboardGet();
    }

    @DoGet("/")
    public View rootGet() {
        return dashboardGet();
    }

    @DoGet("/dashboard")
    public View dashboardGet() {
        return View.builder()
            .template("oylg/dashboard")
            .addVariable("currentMenu", "dashboard")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/cases")
    public View casesGet() {
        return View.builder()
            .template("oylg/dashboard")
            .addVariable("currentMenu", "cases")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/content-approvals")
    public View contentApprovalsGet() {
        return View.builder()
            .template("oylg/dashboard")
            .addVariable("currentMenu", "content_approvals")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/curriculum-graph")
    public View curriculumGraphGet() {
        return View.builder()
            .template("oylg/dashboard")
            .addVariable("currentMenu", "curriculum_graph")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/safety-alerts")
    public View safetyAlertsGet() {
        return View.builder()
            .template("oylg/dashboard")
            .addVariable("currentMenu", "safety_alerts")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/pricing-payouts")
    public View pricingPayoutsGet() {
        return View.builder()
            .template("oylg/dashboard")
            .addVariable("currentMenu", "pricing_payouts")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/boarding-care")
    public View boardingCareGet() {
        return View.builder()
            .template("oylg/dashboard")
            .addVariable("currentMenu", "boarding_care")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }
}
