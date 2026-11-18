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
@Table(name = "oylg_wallet_transactions")
public class OylgWalletTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "student_id")
    private long studentId;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "tx_code")
    private String txCode;

    @Column(name = "tx_type")
    private String txType;

    @Column(name = "delta_sessions")
    private int deltaSessions;

    @Column(name = "delta_amount_vnd")
    private BigDecimal deltaAmountVnd;

    @Column(name = "balance_after")
    private int balanceAfter;

    @Column(name = "reference_code")
    private String referenceCode;

    @Column(name = "description")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public OylgWalletTransaction() {}

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

    public String getTxCode() {
        return txCode;
    }

    public void setTxCode(String txCode) {
        this.txCode = txCode;
    }

    public String getTxType() {
        return txType;
    }

    public void setTxType(String txType) {
        this.txType = txType;
    }

    public int getDeltaSessions() {
        return deltaSessions;
    }

    public void setDeltaSessions(int deltaSessions) {
        this.deltaSessions = deltaSessions;
    }

    public BigDecimal getDeltaAmountVnd() {
        return deltaAmountVnd;
    }

    public void setDeltaAmountVnd(BigDecimal deltaAmountVnd) {
        this.deltaAmountVnd = deltaAmountVnd;
    }

    public int getBalanceAfter() {
        return balanceAfter;
    }

    public void setBalanceAfter(int balanceAfter) {
        this.balanceAfter = balanceAfter;
    }

    public String getReferenceCode() {
        return referenceCode;
    }

    public void setReferenceCode(String referenceCode) {
        this.referenceCode = referenceCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
