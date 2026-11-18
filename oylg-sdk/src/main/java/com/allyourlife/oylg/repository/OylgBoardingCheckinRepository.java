package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgBoardingCheckin;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgBoardingCheckinRepository")
public interface OylgBoardingCheckinRepository extends EzyDatabaseRepository<Long, OylgBoardingCheckin> {
    List<OylgBoardingCheckin> findByStudentId(long studentId);
}
