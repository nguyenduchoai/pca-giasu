package com.allyourlife.oylg.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "oylg_digest_dispatches")
public class OylgDigestDispatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "student_id")
    private long studentId;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "parent_phone")
    private String parentPhone;

    @Column(name = "channel")
    private String channel;

    @Column(name = "digest_date")
    private String digestDate;

    @Column(name = "summary_content")
    private String summaryContent;

    @Column(name = "dispatch_status")
    private String dispatchStatus;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    public OylgDigestDispatch() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public String getParentPhone() {
        return parentPhone;
    }

    public void setParentPhone(String parentPhone) {
        this.parentPhone = parentPhone;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getDigestDate() {
        return digestDate;
    }

    public void setDigestDate(String digestDate) {
        this.digestDate = digestDate;
    }

    public String getSummaryContent() {
        return summaryContent;
    }

    public void setSummaryContent(String summaryContent) {
        this.summaryContent = summaryContent;
    }

    public String getDispatchStatus() {
        return dispatchStatus;
    }

    public void setDispatchStatus(String dispatchStatus) {
        this.dispatchStatus = dispatchStatus;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
