package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgDigestDispatch;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgDigestDispatchRepository")
public interface OylgDigestDispatchRepository extends EzyDatabaseRepository<Long, OylgDigestDispatch> {
    List<OylgDigestDispatch> findByStudentId(long studentId);
}
