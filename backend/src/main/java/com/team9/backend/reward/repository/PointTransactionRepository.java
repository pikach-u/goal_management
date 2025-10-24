package com.team9.backend.reward.repository;

import com.team9.backend.reward.entity.PointTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PointTransactionRepository extends JpaRepository<PointTransaction, Long> {
    List<PointTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
}