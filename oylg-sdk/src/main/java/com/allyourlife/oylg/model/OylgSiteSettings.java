package com.allyourlife.oylg.model;

public class OylgSiteSettings {

    public static final String SETTING_NAME = "oylg_settings";

    private String primaryColor = "#c84b31";
    private boolean announcementEnabled = true;
    private String announcementText =
        "Đồng hành Hướng nghiệp, Cố vấn Cuộc sống & Gia sư bù lỗ hổng gốc Lớp 1–12";
    private String hotline = "1900 636 888";
    private boolean showPackages = true;
    private boolean showExperts = true;
    private boolean showBoarding = true;
    private boolean showConsultation = true;
    private long baseSessionPriceVnd = 200000L;

    public String getPrimaryColor() {
        return primaryColor;
    }

    public void setPrimaryColor(String primaryColor) {
        this.primaryColor = primaryColor;
    }

    public String getValidPrimaryColor() {
        if (primaryColor != null && primaryColor.matches("^#[0-9a-fA-F]{6}$")) {
            return primaryColor;
        }
        return "#c84b31";
    }

    public boolean isAnnouncementEnabled() {
        return announcementEnabled;
    }

    public void setAnnouncementEnabled(boolean announcementEnabled) {
        this.announcementEnabled = announcementEnabled;
    }

    public String getAnnouncementText() {
        return announcementText;
    }

    public void setAnnouncementText(String announcementText) {
        this.announcementText = announcementText;
    }

    public String getHotline() {
        return hotline;
    }

    public void setHotline(String hotline) {
        this.hotline = hotline;
    }

    public boolean isShowPackages() {
        return showPackages;
    }

    public void setShowPackages(boolean showPackages) {
        this.showPackages = showPackages;
    }

    public boolean isShowExperts() {
        return showExperts;
    }

    public void setShowExperts(boolean showExperts) {
        this.showExperts = showExperts;
    }

    public boolean isShowBoarding() {
        return showBoarding;
    }

    public void setShowBoarding(boolean showBoarding) {
        this.showBoarding = showBoarding;
    }

    public boolean isShowConsultation() {
        return showConsultation;
    }

    public void setShowConsultation(boolean showConsultation) {
        this.showConsultation = showConsultation;
    }

    public long getBaseSessionPriceVnd() {
        return baseSessionPriceVnd > 0 ? baseSessionPriceVnd : 200000L;
    }

    public void setBaseSessionPriceVnd(long baseSessionPriceVnd) {
        this.baseSessionPriceVnd = baseSessionPriceVnd;
    }
}
