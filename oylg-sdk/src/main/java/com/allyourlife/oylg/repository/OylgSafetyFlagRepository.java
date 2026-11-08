package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgSafetyFlag;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgSafetyFlagRepository")
public interface OylgSafetyFlagRepository extends EzyDatabaseRepository<Long, OylgSafetyFlag> {

    List<OylgSafetyFlag> findByStudentUserId(long studentUserId);

    long countBySeverityAndStatus(String severity, String status);
}
