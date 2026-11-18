package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgConsultationLead;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgConsultationLeadRepository")
public interface OylgConsultationLeadRepository extends EzyDatabaseRepository<Long, OylgConsultationLead> {
    List<OylgConsultationLead> findByStage(String stage);
}
