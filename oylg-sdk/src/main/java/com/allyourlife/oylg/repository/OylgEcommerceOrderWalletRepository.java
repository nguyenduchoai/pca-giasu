package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgEcommerceOrderWallet;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgEcommerceOrderWalletRepository")
public interface OylgEcommerceOrderWalletRepository extends EzyDatabaseRepository<Long, OylgEcommerceOrderWallet> {
    OylgEcommerceOrderWallet findByOrderCode(String orderCode);
    List<OylgEcommerceOrderWallet> findByStudentId(long studentId);
}
