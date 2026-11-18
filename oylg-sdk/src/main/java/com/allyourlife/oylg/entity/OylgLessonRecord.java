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
@Table(name = "oylg_lesson_records")
public class OylgLessonRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "case_id")
    private long caseId;

    @Column(name = "student_id")
    private long studentId;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "expert_name")
    private String expertName;

    @Column(name = "subject_label")
    private String subjectLabel;

    @Column(name = "unit_code")
    private String unitCode;

    @Column(name = "topic_title")
    private String topicTitle;

    @Column(name = "schedule_label")
    private String scheduleLabel;

    @Column(name = "room_or_link")
    private String roomOrLink;

    @Column(name = "delivery_mode")
    private String deliveryMode;

    @Column(name = "class_type")
    private String classType;

    @Column(name = "lesson_status")
    private String lessonStatus;

    @Column(name = "understanding_level")
    private String understandingLevel;

    @Column(name = "mood_observed")
    private String moodObserved;

    @Column(name = "focus_score")
    private int focusScore;

    @Column(name = "session_price")
    private BigDecimal sessionPrice;

    @Column(name = "expert_payout_amount")
    private BigDecimal expertPayoutAmount;

    @Column(name = "structured_notes")
    private String structuredNotes;

    @Column(name = "sanitized_parent_summary")
    private String sanitizedParentSummary;

    @Column(name = "dlp_masked_count")
    private int dlpMaskedCount;

    @Column(name = "submitted_within_24h")
    private boolean submittedWithin24h;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public OylgLessonRecord() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getCaseId() {
        return caseId;
    }

    public void setCaseId(long caseId) {
        this.caseId = caseId;
    }

    public long getStudentId() {
        return studentId;
    }

    public void setStudentId(long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getExpertName() {
        return expertName;
    }

    public void setExpertName(String expertName) {
        this.expertName = expertName;
    }

    public String getSubjectLabel() {
        return subjectLabel;
    }

    public void setSubjectLabel(String subjectLabel) {
        this.subjectLabel = subjectLabel;
    }

    public String getUnitCode() {
        return unitCode;
    }

    public void setUnitCode(String unitCode) {
        this.unitCode = unitCode;
    }

    public String getTopicTitle() {
        return topicTitle;
    }

    public void setTopicTitle(String topicTitle) {
        this.topicTitle = topicTitle;
    }

    public String getScheduleLabel() {
        return scheduleLabel;
    }

    public void setScheduleLabel(String scheduleLabel) {
        this.scheduleLabel = scheduleLabel;
    }

    public String getRoomOrLink() {
        return roomOrLink;
    }

    public void setRoomOrLink(String roomOrLink) {
        this.roomOrLink = roomOrLink;
    }

    public String getDeliveryMode() {
        return deliveryMode;
    }

    public void setDeliveryMode(String deliveryMode) {
        this.deliveryMode = deliveryMode;
    }

    public String getClassType() {
        return classType;
    }

    public void setClassType(String classType) {
        this.classType = classType;
    }

    public String getLessonStatus() {
        return lessonStatus;
    }

    public void setLessonStatus(String lessonStatus) {
        this.lessonStatus = lessonStatus;
    }

    public String getUnderstandingLevel() {
        return understandingLevel;
    }

    public void setUnderstandingLevel(String understandingLevel) {
        this.understandingLevel = understandingLevel;
    }

    public String getMoodObserved() {
        return moodObserved;
    }

    public void setMoodObserved(String moodObserved) {
        this.moodObserved = moodObserved;
    }

    public int getFocusScore() {
        return focusScore;
    }

    public void setFocusScore(int focusScore) {
        this.focusScore = focusScore;
    }

    public BigDecimal getSessionPrice() {
        return sessionPrice;
    }

    public void setSessionPrice(BigDecimal sessionPrice) {
        this.sessionPrice = sessionPrice;
    }

    public BigDecimal getExpertPayoutAmount() {
        return expertPayoutAmount;
    }

    public void setExpertPayoutAmount(BigDecimal expertPayoutAmount) {
        this.expertPayoutAmount = expertPayoutAmount;
    }

    public String getStructuredNotes() {
        return structuredNotes;
    }

    public void setStructuredNotes(String structuredNotes) {
        this.structuredNotes = structuredNotes;
    }

    public String getSanitizedParentSummary() {
        return sanitizedParentSummary;
    }

    public void setSanitizedParentSummary(String sanitizedParentSummary) {
        this.sanitizedParentSummary = sanitizedParentSummary;
    }

    public int getDlpMaskedCount() {
        return dlpMaskedCount;
    }

    public void setDlpMaskedCount(int dlpMaskedCount) {
        this.dlpMaskedCount = dlpMaskedCount;
    }

    public boolean isSubmittedWithin24h() {
        return submittedWithin24h;
    }

    public void setSubmittedWithin24h(boolean submittedWithin24h) {
        this.submittedWithin24h = submittedWithin24h;
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
