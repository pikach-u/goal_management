package com.team9.backend.reward.repository;

import com.team9.backend.reward.entity.PointsBalance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointBalanceRepository extends JpaRepository<PointsBalance, Long> {
}