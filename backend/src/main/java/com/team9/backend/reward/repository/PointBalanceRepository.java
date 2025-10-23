package com.team9.backend.reward.repository;

import com.team9.backend.reward.entity.PointBalance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointBalanceRepository extends JpaRepository<PointBalance, Long> {
}