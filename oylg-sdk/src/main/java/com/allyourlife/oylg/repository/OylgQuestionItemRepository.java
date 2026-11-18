package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgQuestionItem;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgQuestionItemRepository")
public interface OylgQuestionItemRepository extends EzyDatabaseRepository<Long, OylgQuestionItem> {
    List<OylgQuestionItem> findByApprovalStatus(String approvalStatus);
    List<OylgQuestionItem> findByToolGroup(String toolGroup);
}
