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
@Table(name = "oylg_consultation_leads")
public class OylgConsultationLead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "parent_name")
    private String parentName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "grade")
    private int grade;

    @Column(name = "province")
    private String province;

    @Column(name = "service_interest")
    private String serviceInterest;

    @Column(name = "channel")
    private String channel;

    @Column(name = "referral_code")
    private String referralCode;

    @Column(name = "assigned_expert")
    private String assignedExpert;

    @Column(name = "quoted_amount_vnd")
    private BigDecimal quotedAmountVnd;

    @Column(name = "stage")
    private String stage;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public OylgConsultationLead() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public int getGrade() {
        return grade;
    }

    public void setGrade(int grade) {
        this.grade = grade;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getServiceInterest() {
        return serviceInterest;
    }

    public void setServiceInterest(String serviceInterest) {
        this.serviceInterest = serviceInterest;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getReferralCode() {
        return referralCode;
    }

    public void setReferralCode(String referralCode) {
        this.referralCode = referralCode;
    }

    public String getAssignedExpert() {
        return assignedExpert;
    }

    public void setAssignedExpert(String assignedExpert) {
        this.assignedExpert = assignedExpert;
    }

    public BigDecimal getQuotedAmountVnd() {
        return quotedAmountVnd;
    }

    public void setQuotedAmountVnd(BigDecimal quotedAmountVnd) {
        this.quotedAmountVnd = quotedAmountVnd;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
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
