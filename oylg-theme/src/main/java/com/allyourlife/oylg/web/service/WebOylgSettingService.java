package com.allyourlife.oylg.web.service;

import com.allyourlife.oylg.model.OylgSiteSettings;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tvd12.ezyfox.bean.annotation.EzyPostInit;
import com.tvd12.ezyfox.bean.annotation.EzySingleton;
import org.youngmonkeys.ezyplatform.service.SettingService;

import static com.allyourlife.oylg.model.OylgSiteSettings.SETTING_NAME;

@EzySingleton
public class WebOylgSettingService {

    private static final int CACHE_PERIOD_IN_SECOND = 3;
    private static final OylgSiteSettings DEFAULT_SETTINGS = new OylgSiteSettings();

    private final SettingService settingService;
    private final ObjectMapper objectMapper;

    public WebOylgSettingService(
        SettingService settingService,
        ObjectMapper objectMapper
    ) {
        this.settingService = settingService;
        this.objectMapper = objectMapper;
    }

    @EzyPostInit
    public void postInit() {
        settingService.addValueConverter(
            SETTING_NAME,
            value -> objectMapper.readValue(value, OylgSiteSettings.class)
        );
        settingService.scheduleCacheValue(
            SETTING_NAME,
            CACHE_PERIOD_IN_SECOND
        );
    }

    public OylgSiteSettings getSettings() {
        OylgSiteSettings cached = settingService.getCachedValue(
            SETTING_NAME,
            DEFAULT_SETTINGS
        );
        return cached != null ? cached : DEFAULT_SETTINGS;
    }
}
