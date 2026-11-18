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
@Table(name = "oylg_question_items")
public class OylgQuestionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "question_code")
    private String questionCode;

    @Column(name = "tool_group")
    private String toolGroup;

    @Column(name = "subject_label")
    private String subjectLabel;

    @Column(name = "unit_code")
    private String unitCode;

    @Column(name = "author_name")
    private String authorName;

    @Column(name = "stem_text")
    private String stemText;

    @Column(name = "formula_latex")
    private String formulaLatex;

    @Column(name = "options_json")
    private String optionsJson;

    @Column(name = "irt_discrimination")
    private BigDecimal irtDiscrimination;

    @Column(name = "triggers_safety_flag")
    private boolean triggersSafetyFlag;

    @Column(name = "approval_status")
    private String approvalStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public OylgQuestionItem() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getQuestionCode() {
        return questionCode;
    }

    public void setQuestionCode(String questionCode) {
        this.questionCode = questionCode;
    }

    public String getToolGroup() {
        return toolGroup;
    }

    public void setToolGroup(String toolGroup) {
        this.toolGroup = toolGroup;
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

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getStemText() {
        return stemText;
    }

    public void setStemText(String stemText) {
        this.stemText = stemText;
    }

    public String getFormulaLatex() {
        return formulaLatex;
    }

    public void setFormulaLatex(String formulaLatex) {
        this.formulaLatex = formulaLatex;
    }

    public String getOptionsJson() {
        return optionsJson;
    }

    public void setOptionsJson(String optionsJson) {
        this.optionsJson = optionsJson;
    }

    public BigDecimal getIrtDiscrimination() {
        return irtDiscrimination;
    }

    public void setIrtDiscrimination(BigDecimal irtDiscrimination) {
        this.irtDiscrimination = irtDiscrimination;
    }

    public boolean isTriggersSafetyFlag() {
        return triggersSafetyFlag;
    }

    public void setTriggersSafetyFlag(boolean triggersSafetyFlag) {
        this.triggersSafetyFlag = triggersSafetyFlag;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
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
