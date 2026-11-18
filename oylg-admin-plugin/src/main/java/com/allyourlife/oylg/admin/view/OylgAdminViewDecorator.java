package com.allyourlife.oylg.admin.view;

import com.allyourlife.oylg.repository.OylgLearningCaseRepository;
import com.allyourlife.oylg.repository.OylgSafetyFlagRepository;
import com.tvd12.ezyfox.bean.annotation.EzySingleton;
import com.tvd12.ezyhttp.server.core.view.View;
import com.tvd12.ezyhttp.server.core.view.ViewDecorator;
import org.youngmonkeys.ezyplatform.annotation.AdminId;
import org.youngmonkeys.ezyplatform.rx.Reactive;

import javax.servlet.http.HttpServletRequest;

import static org.youngmonkeys.ezyplatform.constant.CommonConstants.VIEW_VARIABLE_ADDITIONAL_STYLE_FILES;
import static org.youngmonkeys.ezyplatform.constant.CommonConstants.VIEW_VARIABLE_MENUITEM_BADGES;

@EzySingleton
public class OylgAdminViewDecorator implements ViewDecorator {

    private final OylgLearningCaseRepository learningCaseRepository;
    private final OylgSafetyFlagRepository safetyFlagRepository;

    public OylgAdminViewDecorator(
        OylgLearningCaseRepository learningCaseRepository,
        OylgSafetyFlagRepository safetyFlagRepository
    ) {
        this.learningCaseRepository = learningCaseRepository;
        this.safetyFlagRepository = safetyFlagRepository;
    }

    private static final String LOGIN_ROUNDED_FONT_HEAD =
        "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">"
            + "<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>"
            + "<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Quicksand:wght@600;700&display=swap\">"
            + "<style>body,.btn,.form-control,.custom-select{font-family:'Nunito',sans-serif!important;font-weight:500}h1,h2,h3,h4,.login-logo,.card-title{font-family:'Quicksand','Nunito',sans-serif!important;font-weight:700!important}.login-box .card,.btn,.form-control,.custom-select{border-radius:12px}</style>";

    @Override
    public void decorate(HttpServletRequest request, View view) {
        Long adminId = (Long) request.getAttribute(AdminId.class.getName());
        if (adminId == null) {
            view.appendValueToVariable("additionalHeads", LOGIN_ROUNDED_FONT_HEAD);
            return;
        }
        view.appendValueToVariable(
            VIEW_VARIABLE_ADDITIONAL_STYLE_FILES,
            "/oylg/css/style.css"
        );
        view.appendValueToVariable(
            VIEW_VARIABLE_ADDITIONAL_STYLE_FILES,
            "/oylg/css/admin.css"
        );
        view.appendValueToVariable(
            "rightToolbarToolFragments",
            "oylg/fragments/right-toolbar-tool"
        );
        try {
            Reactive.multiple()
                .register(
                    "oylg.cases",
                    () -> learningCaseRepository.countByCaseStatus("ACTIVE")
                )
                .register(
                    "oylg.boarding",
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
            // Safe fallback before tables exist
        }
    }
}
