package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgAuthorizedPickup;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgAuthorizedPickupRepository")
public interface OylgAuthorizedPickupRepository extends EzyDatabaseRepository<Long, OylgAuthorizedPickup> {
    List<OylgAuthorizedPickup> findByStudentId(long studentId);
    OylgAuthorizedPickup findByQrPassToken(String qrPassToken);
}
