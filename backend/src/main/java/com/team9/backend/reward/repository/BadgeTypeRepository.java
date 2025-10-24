package com.team9.backend.reward.repository;

import com.team9.backend.reward.entity.BadgeType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BadgeTypeRepository extends JpaRepository<BadgeType, Long> {
    Optional<BadgeType> findByCodeAndIsActiveTrue(String code);
    List<BadgeType> findByIsActiveTrueOrderByRequiredPointsAsc();
}