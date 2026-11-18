package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgMasteryState;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgMasteryStateRepository")
public interface OylgMasteryStateRepository extends EzyDatabaseRepository<Long, OylgMasteryState> {
    List<OylgMasteryState> findByStudentId(long studentId);
    OylgMasteryState findByStudentIdAndUnitCode(long studentId, String unitCode);
}
