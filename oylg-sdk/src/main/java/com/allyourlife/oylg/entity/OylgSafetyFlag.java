package com.allyourlife.oylg.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "oylg_safety_flags")
public class OylgSafetyFlag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "student_user_id")
    private long studentUserId;

    @Column(name = "case_id")
    private long caseId;

    @Column(name = "source_module")
    private String sourceModule;

    @Column(name = "severity")
    private String severity;

    @Column(name = "trigger_excerpt")
    private String triggerExcerpt;

    @Column(name = "ai_risk_analysis")
    private String aiRiskAnalysis;

    @Column(name = "emergency_hotline_shown")
    private String emergencyHotlineShown;

    @Column(name = "status")
    private String status;

    @Column(name = "verified_by_user_id")
    private long verifiedByUserId;

    @Column(name = "parent_notified_at")
    private LocalDateTime parentNotifiedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public OylgSafetyFlag() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getStudentUserId() {
        return studentUserId;
    }

    public void setStudentUserId(long studentUserId) {
        this.studentUserId = studentUserId;
    }

    public long getCaseId() {
        return caseId;
    }

    public void setCaseId(long caseId) {
        this.caseId = caseId;
    }

    public String getSourceModule() {
        return sourceModule;
    }

    public void setSourceModule(String sourceModule) {
        this.sourceModule = sourceModule;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getTriggerExcerpt() {
        return triggerExcerpt;
    }

    public void setTriggerExcerpt(String triggerExcerpt) {
        this.triggerExcerpt = triggerExcerpt;
    }

    public String getAiRiskAnalysis() {
        return aiRiskAnalysis;
    }

    public void setAiRiskAnalysis(String aiRiskAnalysis) {
        this.aiRiskAnalysis = aiRiskAnalysis;
    }

    public String getEmergencyHotlineShown() {
        return emergencyHotlineShown;
    }

    public void setEmergencyHotlineShown(String emergencyHotlineShown) {
        this.emergencyHotlineShown = emergencyHotlineShown;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getVerifiedByUserId() {
        return verifiedByUserId;
    }

    public void setVerifiedByUserId(long verifiedByUserId) {
        this.verifiedByUserId = verifiedByUserId;
    }

    public LocalDateTime getParentNotifiedAt() {
        return parentNotifiedAt;
    }

    public void setParentNotifiedAt(LocalDateTime parentNotifiedAt) {
        this.parentNotifiedAt = parentNotifiedAt;
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
