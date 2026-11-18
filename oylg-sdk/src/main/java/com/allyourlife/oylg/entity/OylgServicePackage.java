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
@Table(name = "oylg_service_packages")
public class OylgServicePackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "ecommerce_product_id")
    private long ecommerceProductId;

    @Column(name = "package_code")
    private String packageCode;

    @Column(name = "package_tier")
    private String packageTier;

    @Column(name = "tier_badge")
    private String tierBadge;

    @Column(name = "title")
    private String title;

    @Column(name = "summary")
    private String summary;

    @Column(name = "features_json")
    private String featuresJson;

    @Column(name = "session_credits_granted")
    private int sessionCreditsGranted;

    @Column(name = "billing_term_months")
    private int billingTermMonths;

    @Column(name = "discount_percent")
    private BigDecimal discountPercent;

    @Column(name = "list_price_vnd")
    private BigDecimal listPriceVnd;

    @Column(name = "net_price_vnd")
    private BigDecimal netPriceVnd;

    @Column(name = "six_month_reference_vnd")
    private BigDecimal sixMonthReferenceVnd;

    @Column(name = "featured")
    private boolean featured;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public OylgServicePackage() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getEcommerceProductId() {
        return ecommerceProductId;
    }

    public void setEcommerceProductId(long ecommerceProductId) {
        this.ecommerceProductId = ecommerceProductId;
    }

    public String getPackageCode() {
        return packageCode;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }

    public String getPackageTier() {
        return packageTier;
    }

    public void setPackageTier(String packageTier) {
        this.packageTier = packageTier;
    }

    public String getTierBadge() {
        return tierBadge;
    }

    public void setTierBadge(String tierBadge) {
        this.tierBadge = tierBadge;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getFeaturesJson() {
        return featuresJson;
    }

    public void setFeaturesJson(String featuresJson) {
        this.featuresJson = featuresJson;
    }

    public int getSessionCreditsGranted() {
        return sessionCreditsGranted;
    }

    public void setSessionCreditsGranted(int sessionCreditsGranted) {
        this.sessionCreditsGranted = sessionCreditsGranted;
    }

    public int getBillingTermMonths() {
        return billingTermMonths;
    }

    public void setBillingTermMonths(int billingTermMonths) {
        this.billingTermMonths = billingTermMonths;
    }

    public BigDecimal getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(BigDecimal discountPercent) {
        this.discountPercent = discountPercent;
    }

    public BigDecimal getListPriceVnd() {
        return listPriceVnd;
    }

    public void setListPriceVnd(BigDecimal listPriceVnd) {
        this.listPriceVnd = listPriceVnd;
    }

    public BigDecimal getNetPriceVnd() {
        return netPriceVnd;
    }

    public void setNetPriceVnd(BigDecimal netPriceVnd) {
        this.netPriceVnd = netPriceVnd;
    }

    public BigDecimal getSixMonthReferenceVnd() {
        return sixMonthReferenceVnd;
    }

    public void setSixMonthReferenceVnd(BigDecimal sixMonthReferenceVnd) {
        this.sixMonthReferenceVnd = sixMonthReferenceVnd;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
