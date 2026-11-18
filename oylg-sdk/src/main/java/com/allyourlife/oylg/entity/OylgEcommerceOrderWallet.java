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
@Table(name = "oylg_ecommerce_order_wallets")
public class OylgEcommerceOrderWallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "ecommerce_order_id")
    private long ecommerceOrderId;

    @Column(name = "order_code")
    private String orderCode;

    @Column(name = "student_id")
    private long studentId;

    @Column(name = "parent_name")
    private String parentName;

    @Column(name = "parent_phone")
    private String parentPhone;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "package_title")
    private String packageTitle;

    @Column(name = "voucher_code")
    private String voucherCode;

    @Column(name = "referral_code")
    private String referralCode;

    @Column(name = "subtotal_amount_vnd")
    private BigDecimal subtotalAmountVnd;

    @Column(name = "discount_amount_vnd")
    private BigDecimal discountAmountVnd;

    @Column(name = "net_paid_amount_vnd")
    private BigDecimal netPaidAmountVnd;

    @Column(name = "dthh_base_vnd")
    private BigDecimal dthhBaseVnd;

    @Column(name = "rep_commission_vnd")
    private BigDecimal repCommissionVnd;

    @Column(name = "leader_commission_vnd")
    private BigDecimal leaderCommissionVnd;

    @Column(name = "total_sessions_granted")
    private int totalSessionsGranted;

    @Column(name = "consumed_sessions_count")
    private int consumedSessionsCount;

    @Column(name = "payment_channel")
    private String paymentChannel;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "refund_guaranteed_until")
    private LocalDateTime refundGuaranteedUntil;

    @Column(name = "refunded_amount_vnd")
    private BigDecimal refundedAmountVnd;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public OylgEcommerceOrderWallet() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getEcommerceOrderId() {
        return ecommerceOrderId;
    }

    public void setEcommerceOrderId(long ecommerceOrderId) {
        this.ecommerceOrderId = ecommerceOrderId;
    }

    public String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(String orderCode) {
        this.orderCode = orderCode;
    }

    public long getStudentId() {
        return studentId;
    }

    public void setStudentId(long studentId) {
        this.studentId = studentId;
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

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getPackageTitle() {
        return packageTitle;
    }

    public void setPackageTitle(String packageTitle) {
        this.packageTitle = packageTitle;
    }

    public String getVoucherCode() {
        return voucherCode;
    }

    public void setVoucherCode(String voucherCode) {
        this.voucherCode = voucherCode;
    }

    public String getReferralCode() {
        return referralCode;
    }

    public void setReferralCode(String referralCode) {
        this.referralCode = referralCode;
    }

    public BigDecimal getSubtotalAmountVnd() {
        return subtotalAmountVnd;
    }

    public void setSubtotalAmountVnd(BigDecimal subtotalAmountVnd) {
        this.subtotalAmountVnd = subtotalAmountVnd;
    }

    public BigDecimal getDiscountAmountVnd() {
        return discountAmountVnd;
    }

    public void setDiscountAmountVnd(BigDecimal discountAmountVnd) {
        this.discountAmountVnd = discountAmountVnd;
    }

    public BigDecimal getNetPaidAmountVnd() {
        return netPaidAmountVnd;
    }

    public void setNetPaidAmountVnd(BigDecimal netPaidAmountVnd) {
        this.netPaidAmountVnd = netPaidAmountVnd;
    }

    public BigDecimal getDthhBaseVnd() {
        return dthhBaseVnd;
    }

    public void setDthhBaseVnd(BigDecimal dthhBaseVnd) {
        this.dthhBaseVnd = dthhBaseVnd;
    }

    public BigDecimal getRepCommissionVnd() {
        return repCommissionVnd;
    }

    public void setRepCommissionVnd(BigDecimal repCommissionVnd) {
        this.repCommissionVnd = repCommissionVnd;
    }

    public BigDecimal getLeaderCommissionVnd() {
        return leaderCommissionVnd;
    }

    public void setLeaderCommissionVnd(BigDecimal leaderCommissionVnd) {
        this.leaderCommissionVnd = leaderCommissionVnd;
    }

    public int getTotalSessionsGranted() {
        return totalSessionsGranted;
    }

    public void setTotalSessionsGranted(int totalSessionsGranted) {
        this.totalSessionsGranted = totalSessionsGranted;
    }

    public int getConsumedSessionsCount() {
        return consumedSessionsCount;
    }

    public void setConsumedSessionsCount(int consumedSessionsCount) {
        this.consumedSessionsCount = consumedSessionsCount;
    }

    public String getPaymentChannel() {
        return paymentChannel;
    }

    public void setPaymentChannel(String paymentChannel) {
        this.paymentChannel = paymentChannel;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getRefundGuaranteedUntil() {
        return refundGuaranteedUntil;
    }

    public void setRefundGuaranteedUntil(LocalDateTime refundGuaranteedUntil) {
        this.refundGuaranteedUntil = refundGuaranteedUntil;
    }

    public BigDecimal getRefundedAmountVnd() {
        return refundedAmountVnd;
    }

    public void setRefundedAmountVnd(BigDecimal refundedAmountVnd) {
        this.refundedAmountVnd = refundedAmountVnd;
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
