package com.allyourlife.oylg.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "oylg_learning_cases")
public class OylgLearningCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "case_code")
    private String caseCode;

    @Column(name = "student_user_id")
    private long studentUserId;

    @Column(name = "parent_user_id")
    private long parentUserId;

    @Column(name = "career_expert_user_id")
    private long careerExpertUserId;

    @Column(name = "life_coach_user_id")
    private long lifeCoachUserId;

    @Column(name = "care_agent_admin_id")
    private long careAgentAdminId;

    @Column(name = "current_tier")
    private String currentTier;

    @Column(name = "case_status")
    private String caseStatus;

    @Column(name = "r1_report_status")
    private String r1ReportStatus;

    @Column(name = "r2_report_status")
    private String r2ReportStatus;

    @Column(name = "r3_report_status")
    private String r3ReportStatus;

    @Column(name = "remedial_ratio_percent")
    private int remedialRatioPercent;

    @Column(name = "current_grade_ratio_percent")
    private int currentGradeRatioPercent;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public OylgLearningCase() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCaseCode() {
        return caseCode;
    }

    public void setCaseCode(String caseCode) {
        this.caseCode = caseCode;
    }

    public long getStudentUserId() {
        return studentUserId;
    }

    public void setStudentUserId(long studentUserId) {
        this.studentUserId = studentUserId;
    }

    public long getParentUserId() {
        return parentUserId;
    }

    public void setParentUserId(long parentUserId) {
        this.parentUserId = parentUserId;
    }

    public long getCareerExpertUserId() {
        return careerExpertUserId;
    }

    public void setCareerExpertUserId(long careerExpertUserId) {
        this.careerExpertUserId = careerExpertUserId;
    }

    public long getLifeCoachUserId() {
        return lifeCoachUserId;
    }

    public void setLifeCoachUserId(long lifeCoachUserId) {
        this.lifeCoachUserId = lifeCoachUserId;
    }

    public long getCareAgentAdminId() {
        return careAgentAdminId;
    }

    public void setCareAgentAdminId(long careAgentAdminId) {
        this.careAgentAdminId = careAgentAdminId;
    }

    public String getCurrentTier() {
        return currentTier;
    }

    public void setCurrentTier(String currentTier) {
        this.currentTier = currentTier;
    }

    public String getCaseStatus() {
        return caseStatus;
    }

    public void setCaseStatus(String caseStatus) {
        this.caseStatus = caseStatus;
    }

    public String getR1ReportStatus() {
        return r1ReportStatus;
    }

    public void setR1ReportStatus(String r1ReportStatus) {
        this.r1ReportStatus = r1ReportStatus;
    }

    public String getR2ReportStatus() {
        return r2ReportStatus;
    }

    public void setR2ReportStatus(String r2ReportStatus) {
        this.r2ReportStatus = r2ReportStatus;
    }

    public String getR3ReportStatus() {
        return r3ReportStatus;
    }

    public void setR3ReportStatus(String r3ReportStatus) {
        this.r3ReportStatus = r3ReportStatus;
    }

    public int getRemedialRatioPercent() {
        return remedialRatioPercent;
    }

    public void setRemedialRatioPercent(int remedialRatioPercent) {
        this.remedialRatioPercent = remedialRatioPercent;
    }

    public int getCurrentGradeRatioPercent() {
        return currentGradeRatioPercent;
    }

    public void setCurrentGradeRatioPercent(int currentGradeRatioPercent) {
        this.currentGradeRatioPercent = currentGradeRatioPercent;
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
