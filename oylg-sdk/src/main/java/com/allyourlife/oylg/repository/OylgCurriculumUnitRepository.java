package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgCurriculumUnit;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgCurriculumUnitRepository")
public interface OylgCurriculumUnitRepository extends EzyDatabaseRepository<Long, OylgCurriculumUnit> {
    OylgCurriculumUnit findByUnitCode(String unitCode);
    List<OylgCurriculumUnit> findBySubjectCode(String subjectCode);
}
