package com.team9.backend.reward.repository;

import com.team9.backend.reward.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    boolean existsByUserIdAndBadgeIdAndIsRevokedFalse(Long userId, Long badgeId);
    List<UserBadge> findByUserIdAndIsRevokedFalse(Long userId);
}