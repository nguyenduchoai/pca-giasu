package com.allyourlife.oylg.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "oylg_expert_profiles")
public class OylgExpertProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "user_id")
    private long userId;

    @Column(name = "expert_code")
    private String expertCode;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "role_title")
    private String roleTitle;

    @Column(name = "expert_role")
    private String expertRole;

    @Column(name = "tier")
    private String tier;

    @Column(name = "subjects_json")
    private String subjectsJson;

    @Column(name = "bio_summary")
    private String bioSummary;

    @Column(name = "highlight_metric")
    private String highlightMetric;

    @Column(name = "portrait_url")
    private String portraitUrl;

    @Column(name = "landing_page_slug")
    private String landingPageSlug;

    @Column(name = "base_payout_per_session")
    private BigDecimal basePayoutPerSession;

    @Column(name = "review_rate_per_item")
    private BigDecimal reviewRatePerItem;

    @Column(name = "student_count")
    private int studentCount;

    @Column(name = "verified_status")
    private String verifiedStatus;

    @Column(name = "rating_avg")
    private BigDecimal ratingAvg;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public OylgExpertProfile() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getExpertCode() {
        return expertCode;
    }

    public void setExpertCode(String expertCode) {
        this.expertCode = expertCode;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getRoleTitle() {
        return roleTitle;
    }

    public void setRoleTitle(String roleTitle) {
        this.roleTitle = roleTitle;
    }

    public String getExpertRole() {
        return expertRole;
    }

    public void setExpertRole(String expertRole) {
        this.expertRole = expertRole;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    public String getSubjectsJson() {
        return subjectsJson;
    }

    public void setSubjectsJson(String subjectsJson) {
        this.subjectsJson = subjectsJson;
    }

    public String getBioSummary() {
        return bioSummary;
    }

    public void setBioSummary(String bioSummary) {
        this.bioSummary = bioSummary;
    }

    public String getHighlightMetric() {
        return highlightMetric;
    }

    public void setHighlightMetric(String highlightMetric) {
        this.highlightMetric = highlightMetric;
    }

    public String getPortraitUrl() {
        return portraitUrl;
    }

    public void setPortraitUrl(String portraitUrl) {
        this.portraitUrl = portraitUrl;
    }

    public String getLandingPageSlug() {
        return landingPageSlug;
    }

    public void setLandingPageSlug(String landingPageSlug) {
        this.landingPageSlug = landingPageSlug;
    }

    public BigDecimal getBasePayoutPerSession() {
        return basePayoutPerSession;
    }

    public void setBasePayoutPerSession(BigDecimal basePayoutPerSession) {
        this.basePayoutPerSession = basePayoutPerSession;
    }

    public BigDecimal getReviewRatePerItem() {
        return reviewRatePerItem;
    }

    public void setReviewRatePerItem(BigDecimal reviewRatePerItem) {
        this.reviewRatePerItem = reviewRatePerItem;
    }

    public int getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(int studentCount) {
        this.studentCount = studentCount;
    }

    public String getVerifiedStatus() {
        return verifiedStatus;
    }

    public void setVerifiedStatus(String verifiedStatus) {
        this.verifiedStatus = verifiedStatus;
    }

    public BigDecimal getRatingAvg() {
        return ratingAvg;
    }

    public void setRatingAvg(BigDecimal ratingAvg) {
        this.ratingAvg = ratingAvg;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
