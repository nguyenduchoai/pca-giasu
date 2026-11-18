package com.allyourlife.oylg.repository;

import com.allyourlife.oylg.entity.OylgWalletTransaction;
import com.tvd12.ezydata.database.EzyDatabaseRepository;
import com.tvd12.ezyfox.database.annotation.EzyRepository;

import java.util.List;

@EzyRepository("oylgWalletTransactionRepository")
public interface OylgWalletTransactionRepository extends EzyDatabaseRepository<Long, OylgWalletTransaction> {
    List<OylgWalletTransaction> findByStudentId(long studentId);
}
