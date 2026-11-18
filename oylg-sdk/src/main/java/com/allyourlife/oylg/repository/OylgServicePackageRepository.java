package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgServicePackage;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgServicePackageRepository")
public interface OylgServicePackageRepository extends EzyDatabaseRepository<Long, OylgServicePackage> {
    OylgServicePackage findByPackageCode(String packageCode);
    List<OylgServicePackage> findByStatus(String status);
}
