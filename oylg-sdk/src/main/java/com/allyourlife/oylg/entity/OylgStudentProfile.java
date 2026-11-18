package com.allyourlife.oylg.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "oylg_student_profiles")
public class OylgStudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "user_id")
    private long userId;

    @Column(name = "parent_user_id")
    private long parentUserId;

    @Column(name = "student_code")
    private String studentCode;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "parent_name")
    private String parentName;

    @Column(name = "parent_phone")
    private String parentPhone;

    @Column(name = "current_grade")
    private int currentGrade;

    @Column(name = "school_name")
    private String schoolName;

    @Column(name = "target_school")
    private String targetSchool;

    @Column(name = "target_major")
    private String targetMajor;

    @Column(name = "riasec_code")
    private String riasecCode;

    @Column(name = "session_credits_remaining")
    private int sessionCreditsRemaining;

    @Column(name = "streak_days")
    private int streakDays;

    @Column(name = "xp_points")
    private int xpPoints;

    @Column(name = "mood_status")
    private String moodStatus;

    @Column(name = "overall_health_status")
    private String overallHealthStatus;

    @Column(name = "allergies_json")
    private String allergiesJson;

    @Column(name = "daily_tasks_json")
    private String dailyTasksJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public OylgStudentProfile() {}

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

    public long getParentUserId() {
        return parentUserId;
    }

    public void setParentUserId(long parentUserId) {
        this.parentUserId = parentUserId;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getParentPhone() {
        return parentPhone;
    }

    public void setParentPhone(String parentPhone) {
        this.parentPhone = parentPhone;
    }

    public int getCurrentGrade() {
        return currentGrade;
    }

    public void setCurrentGrade(int currentGrade) {
        this.currentGrade = currentGrade;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public String getTargetSchool() {
        return targetSchool;
    }

    public void setTargetSchool(String targetSchool) {
        this.targetSchool = targetSchool;
    }

    public String getTargetMajor() {
        return targetMajor;
    }

    public void setTargetMajor(String targetMajor) {
        this.targetMajor = targetMajor;
    }

    public String getRiasecCode() {
        return riasecCode;
    }

    public void setRiasecCode(String riasecCode) {
        this.riasecCode = riasecCode;
    }

    public int getSessionCreditsRemaining() {
        return sessionCreditsRemaining;
    }

    public void setSessionCreditsRemaining(int sessionCreditsRemaining) {
        this.sessionCreditsRemaining = sessionCreditsRemaining;
    }

    public int getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(int streakDays) {
        this.streakDays = streakDays;
    }

    public int getXpPoints() {
        return xpPoints;
    }

    public void setXpPoints(int xpPoints) {
        this.xpPoints = xpPoints;
    }

    public String getMoodStatus() {
        return moodStatus;
    }

    public void setMoodStatus(String moodStatus) {
        this.moodStatus = moodStatus;
    }

    public String getOverallHealthStatus() {
        return overallHealthStatus;
    }

    public void setOverallHealthStatus(String overallHealthStatus) {
        this.overallHealthStatus = overallHealthStatus;
    }

    public String getAllergiesJson() {
        return allergiesJson;
    }

    public void setAllergiesJson(String allergiesJson) {
        this.allergiesJson = allergiesJson;
    }

    public String getDailyTasksJson() {
        return dailyTasksJson;
    }

    public void setDailyTasksJson(String dailyTasksJson) {
        this.dailyTasksJson = dailyTasksJson;
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
