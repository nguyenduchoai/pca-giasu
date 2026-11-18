package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgPortalAccount;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

@EzyRepository("oylgPortalAccountRepository")
public interface OylgPortalAccountRepository extends EzyDatabaseRepository<Long, OylgPortalAccount> {
    OylgPortalAccount findByPhone(String phone);
    OylgPortalAccount findBySessionToken(String sessionToken);
}
