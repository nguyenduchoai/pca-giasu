package com.allyourlife.oylg.web.controller.view;

import com.allyourlife.oylg.service.OylgPricingService;
import com.tvd12.ezyhttp.server.core.annotation.Controller;
import com.tvd12.ezyhttp.server.core.annotation.DoGet;
import com.tvd12.ezyhttp.server.core.annotation.PathVariable;
import com.tvd12.ezyhttp.server.core.view.View;

@Controller
public class OylgWebViewController {

    private final OylgPricingService pricingService;

    public OylgWebViewController(OylgPricingService pricingService) {
        this.pricingService = pricingService;
    }

    @DoGet("/")
    public View homeGet() {
        return View.builder()
            .template("home")
            .addVariable("pageTitle", "page_title.home")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/pages/{slug}")
    public View pageSlugGet(@PathVariable String slug) {
        return View.builder()
            .template("home")
            .addVariable("pageTitle", "page_title.home")
            .addVariable("activeSlug", slug)
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/parent")
    public View parentGet() {
        return View.builder()
            .template("home")
            .addVariable("pageTitle", "page_title.parent_portal")
            .addVariable("activePortal", "parent")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/student")
    public View studentGet() {
        return View.builder()
            .template("home")
            .addVariable("pageTitle", "page_title.student_workspace")
            .addVariable("activePortal", "student")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/coach")
    public View coachGet() {
        return View.builder()
            .template("home")
            .addVariable("pageTitle", "page_title.expert_workspace")
            .addVariable("activePortal", "coach")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/studio")
    public View studioGet() {
        return View.builder()
            .template("home")
            .addVariable("pageTitle", "page_title.expert_workspace")
            .addVariable("activePortal", "studio")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/operations/sales")
    public View salesGet() {
        return View.builder()
            .template("home")
            .addVariable("pageTitle", "page_title.expert_workspace")
            .addVariable("activePortal", "sales")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/operations/boarding")
    public View boardingGet() {
        return View.builder()
            .template("home")
            .addVariable("pageTitle", "page_title.parent_portal")
            .addVariable("activePortal", "boarding")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }

    @DoGet("/admin")
    public View adminGet() {
        return View.builder()
            .template("home")
            .addVariable("pageTitle", "page_title.home")
            .addVariable("activePortal", "admin")
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .build();
    }
}
