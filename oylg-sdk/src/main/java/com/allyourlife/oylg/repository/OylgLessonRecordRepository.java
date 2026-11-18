package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgLessonRecord;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgLessonRecordRepository")
public interface OylgLessonRecordRepository extends EzyDatabaseRepository<Long, OylgLessonRecord> {
    List<OylgLessonRecord> findByStudentId(long studentId);
    List<OylgLessonRecord> findByLessonStatus(String lessonStatus);
}
