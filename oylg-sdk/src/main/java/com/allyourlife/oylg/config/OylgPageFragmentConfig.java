package com.allyourlife.oylg.config;

import com.tvd12.ezyfox.bean.EzyBeanConfig;
import com.tvd12.ezyfox.bean.EzyBeanContext;
import com.tvd12.ezyfox.bean.annotation.EzyAutoBind;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Đặt tại module: oylg-sdk (100% SSOT)
 * Đăng ký toàn bộ các vùng nội dung (Page Fragments) theo chuẩn EzyPlatform Theme.
 */
public class OylgPageFragmentConfig implements EzyBeanConfig {

    @EzyAutoBind
    private EzyBeanContext beanContext;

    private static final Map<String, List<String>> REGISTERED_FRAGMENTS =
        new LinkedHashMap<>();

    public void setBeanContext(EzyBeanContext beanContext) {
        this.beanContext = beanContext;
    }

    @Override
    public void config() {
        registerFragmentNames(
            "common",
            "styles",
            "scripts",
            "header",
            "footer",
            "main_header_announcement",
            "services_title",
            "why_choose_us_title",
            "members_title",
            "reviews_title",
            "appointment_scheduling_cta",
            "floating_contact_buttons"
        );
        registerFragmentNames(
            "home",
            "main_banner",
            "three_tier_ecosystem_intro",
            "about_us",
            "featured_services_intro",
            "b6_pricing_simulator_intro",
            "why_choose_us",
            "key_metrics_counter",
            "customer_testimonials_intro",
            "latest_news_intro",
            "popup"
        );
        registerFragmentNames(
            "about_us",
            "introduction",
            "vision_mission_core_values",
            "four_golden_guardrails",
            "leadership_team_intro"
        );
        registerFragmentNames(
            "contact",
            "map",
            "contact_information",
            "working_hours"
        );
        registerFragmentNames(
            "footer",
            "company_intro",
            "contact_information",
            "copyright"
        );
    }

    private void registerFragmentNames(String pageName, String... fragmentNames) {
        REGISTERED_FRAGMENTS.put(pageName, Arrays.asList(fragmentNames));
        if (beanContext == null) {
            return;
        }
        try {
            Class<?> managerClass = Class.forName(
                "org.youngmonkeys.ezyarticle.sdk.manager.PageFragmentManager"
            );
            Object manager = beanContext.getSingleton(managerClass);
            if (manager != null) {
                Method method = managerClass.getMethod(
                    "registerFragmentNames",
                    String.class,
                    String[].class
                );
                method.invoke(manager, pageName, fragmentNames);
            }
        } catch (Throwable ignored) {
            // Khi chưa cài ezyarticle từ Market, sử dụng bộ nhớ nội tại của oylg-sdk
        }
    }

    public static Map<String, List<String>> getRegisteredFragments() {
        return Collections.unmodifiableMap(REGISTERED_FRAGMENTS);
    }
}
