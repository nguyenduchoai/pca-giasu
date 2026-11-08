package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgLearningCase;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgLearningCaseRepository")
public interface OylgLearningCaseRepository extends EzyDatabaseRepository<Long, OylgLearningCase> {

    OylgLearningCase findByCaseCode(String caseCode);

    List<OylgLearningCase> findByStudentUserId(long studentUserId);

    List<OylgLearningCase> findByParentUserId(long parentUserId);

    long countByCaseStatus(String caseStatus);
}
