package com.allyourlife.oylg.admin.service;

import com.allyourlife.oylg.model.OylgSiteSettings;
import com.allyourlife.oylg.service.OylgPricingService;
import com.tvd12.ezyfox.bean.annotation.EzySingleton;
import org.youngmonkeys.ezyplatform.admin.service.AdminSettingService;

import static com.allyourlife.oylg.model.OylgSiteSettings.SETTING_NAME;

@EzySingleton
public class AdminOylgSettingService {

    private final AdminSettingService settingService;
    private final OylgPricingService pricingService;

    public AdminOylgSettingService(
        AdminSettingService settingService,
        OylgPricingService pricingService
    ) {
        this.settingService = settingService;
        this.pricingService = pricingService;
    }

    public OylgSiteSettings getSettings() {
        OylgSiteSettings settings = settingService.getObjectValue(
            SETTING_NAME,
            OylgSiteSettings.class,
            new OylgSiteSettings()
        );
        settings.setBaseSessionPriceVnd(
            pricingService.getBaseSessionPrice().longValue()
        );
        return settings;
    }

    public void saveSettings(OylgSiteSettings settings) {
        if (settings.getBaseSessionPriceVnd() >= 50000L) {
            pricingService.setBaseSessionPrice(settings.getBaseSessionPriceVnd());
        }
        settingService.setObjectValue(SETTING_NAME, settings);
        settingService.setLastUpdateTime(SETTING_NAME);
    }

    public String getWebUrl() {
        String url = settingService.getWebUrl();
        if (url == null || url.trim().isEmpty()) {
            return "http://localhost:18080";
        }
        return url;
    }
}
