package com.allyourlife.oylg.admin.controller.api;

import com.allyourlife.oylg.entity.OylgGroupClass;
import com.allyourlife.oylg.entity.OylgQuestionItem;
import com.allyourlife.oylg.entity.OylgSafetyFlag;
import com.allyourlife.oylg.service.OylgPlatformService;
import com.allyourlife.oylg.service.OylgPricingService;
import com.tvd12.ezyhttp.core.response.ResponseEntity;
import com.tvd12.ezyhttp.server.core.annotation.Api;
import com.tvd12.ezyhttp.server.core.annotation.Authenticated;
import com.tvd12.ezyhttp.server.core.annotation.Controller;
import com.tvd12.ezyhttp.server.core.annotation.DoPost;
import com.tvd12.ezyhttp.server.core.annotation.PathVariable;
import com.tvd12.ezyhttp.server.core.annotation.RequestBody;

import java.util.HashMap;
import java.util.Map;

@Api
@Authenticated
@Controller("/api/v1/oylg")
public class AdminOylgApiController {

    private final OylgPlatformService platformService;
    private final OylgPricingService pricingService;

    public AdminOylgApiController(
        OylgPlatformService platformService,
        OylgPricingService pricingService
    ) {
        this.platformService = platformService;
        this.pricingService = pricingService;
    }

    @DoPost("/settings/base-price")
    public ResponseEntity saveBasePrice(@RequestBody Map<String, Object> req) {
        long price = 200000L;
        if (req != null && req.get("basePriceVnd") != null) {
            price = Long.parseLong(String.valueOf(req.get("basePriceVnd")).replaceAll("[^0-9]", ""));
        }
        pricingService.setBaseSessionPrice(price);
        Map<String, Object> res = new HashMap<>();
        res.put("ok", true);
        res.put("basePriceVnd", pricingService.getBaseSessionPrice());
        return ResponseEntity.ok(res);
    }

    @DoPost("/questions/{id}/review")
    public ResponseEntity reviewQuestion(
        @PathVariable("id") long id,
        @RequestBody Map<String, Object> req
    ) {
        String status = req != null && req.get("status") != null
            ? String.valueOf(req.get("status"))
            : "APPROVED";
        OylgQuestionItem q = platformService.reviewQuestion(id, status);
        Map<String, Object> res = new HashMap<>();
        res.put("ok", q != null);
        return ResponseEntity.ok(res);
    }

    @DoPost("/safety-flags/{id}/resolve")
    public ResponseEntity resolveFlag(@PathVariable("id") long id) {
        OylgSafetyFlag flag = platformService.resolveSafetyFlag(id);
        Map<String, Object> res = new HashMap<>();
        res.put("ok", flag != null);
        return ResponseEntity.ok(res);
    }

    @DoPost("/group-classes/{id}/action")
    public ResponseEntity groupClassAction(
        @PathVariable("id") long id,
        @RequestBody Map<String, Object> req
    ) {
        String action = req != null && req.get("action") != null
            ? String.valueOf(req.get("action"))
            : "ACTIVATE";
        OylgGroupClass gc = platformService.updateGroupClassAction(id, action);
        Map<String, Object> res = new HashMap<>();
        res.put("ok", gc != null);
        return ResponseEntity.ok(res);
    }
}
