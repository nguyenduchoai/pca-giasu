package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgResidency;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgResidencyRepository")
public interface OylgResidencyRepository extends EzyDatabaseRepository<Long, OylgResidency> {
    List<OylgResidency> findByStudentId(long studentId);
}
