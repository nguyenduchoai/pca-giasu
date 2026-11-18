package com.allyourlife.oylg.admin.view;

import com.allyourlife.oylg.repository.OylgLearningCaseRepository;
import com.allyourlife.oylg.repository.OylgSafetyFlagRepository;
import com.tvd12.ezyfox.bean.annotation.EzySingleton;
import com.tvd12.ezyhttp.server.core.view.View;
import com.tvd12.ezyhttp.server.core.view.ViewDecorator;
import org.youngmonkeys.ezyplatform.rx.Reactive;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

import static org.youngmonkeys.ezyplatform.constant.CommonConstants.VIEW_VARIABLE_MENUITEM_BADGES;

@EzySingleton
public class OylgAdminViewDecorator implements ViewDecorator {

    private static final String FONT_HEAD =
        "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />"
        + "<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin=\"anonymous\" />"
        + "<link href=\"https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap\" rel=\"stylesheet\" />";

    private final OylgLearningCaseRepository learningCaseRepository;
    private final OylgSafetyFlagRepository safetyFlagRepository;
    private final String modernAdminCss;

    public OylgAdminViewDecorator(
        OylgLearningCaseRepository learningCaseRepository,
        OylgSafetyFlagRepository safetyFlagRepository
    ) {
        this.learningCaseRepository = learningCaseRepository;
        this.safetyFlagRepository = safetyFlagRepository;
        this.modernAdminCss = loadThemeCss();
    }

    @Override
    public void decorate(HttpServletRequest request, View view) {
        view.appendValueToVariable("additionalHeads", FONT_HEAD);
        if (!modernAdminCss.isEmpty()) {
            view.appendValueToVariable("additionalStyles", modernAdminCss);
        }
        view.appendValueToVariable(
            "rightToolbarToolFragments",
            "oylg/fragments/right-toolbar-tool"
        );
        try {
            Reactive.multiple()
                .register(
                    "oylg.oylg.cases",
                    () -> learningCaseRepository.countByCaseStatus("ACTIVE")
                )
                .register(
                    "oylg.oylg.boarding",
                    () -> safetyFlagRepository.countBySeverityAndStatus(
                        "RED_URGENT",
                        "PENDING_EXPERT_VERIFY"
                    )
                )
                .blockingConsume(it ->
                    view.putKeyValuesToVariable(
                        VIEW_VARIABLE_MENUITEM_BADGES,
                        it.valueMap()
                    )
                );
        } catch (Exception ignored) {
            // Safe fallback before initial setup
        }
    }

    private String loadThemeCss() {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("static/oylg/css/oylg-admin-theme.css")) {
            if (is == null) {
                return "";
            }
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
                return reader.lines().collect(Collectors.joining("\n"));
            }
        } catch (Exception e) {
            return "";
        }
    }
}
