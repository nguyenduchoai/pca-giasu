package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgStudentProfile;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

@EzyRepository("oylgStudentProfileRepository")
public interface OylgStudentProfileRepository extends EzyDatabaseRepository<Long, OylgStudentProfile> {
    OylgStudentProfile findByStudentCode(String studentCode);
}
