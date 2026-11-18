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

    @Override
    public void decorate(HttpServletRequest request, View view) {
        Long adminId = (Long) request.getAttribute(AdminId.class.getName());
        if (adminId == null) {
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
