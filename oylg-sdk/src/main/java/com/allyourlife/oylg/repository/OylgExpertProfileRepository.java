package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgExpertProfile;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

@EzyRepository("oylgExpertProfileRepository")
public interface OylgExpertProfileRepository extends EzyDatabaseRepository<Long, OylgExpertProfile> {
    OylgExpertProfile findByLandingPageSlug(String landingPageSlug);
    OylgExpertProfile findByExpertCode(String expertCode);
}
