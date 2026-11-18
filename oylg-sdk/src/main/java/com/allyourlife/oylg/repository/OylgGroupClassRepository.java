package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgGroupClass;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

@EzyRepository("oylgGroupClassRepository")
public interface OylgGroupClassRepository extends EzyDatabaseRepository<Long, OylgGroupClass> {
    OylgGroupClass findByGroupCode(String groupCode);
}
