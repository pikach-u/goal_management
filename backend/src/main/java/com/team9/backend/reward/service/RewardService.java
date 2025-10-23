package com.team9.backend.reward.service;

import com.team9.backend.reward.dto.BalanceResponse;
import com.team9.backend.reward.entity.BadgeType;
import com.team9.backend.reward.repository.BadgeTypeRepository;
import com.team9.backend.reward.repository.UserBadgeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class RewardService {

    private final PointsService pointsService;
    private final BadgeService badgeService;
    private final BadgeTypeRepository badgeTypeRepo;
    private final UserBadgeRepository userBadgeRepo;

    @Transactional
    public BalanceResponse grantPointsAndAutoBadges(Long userId, long amount, String reason, String ref) {
        BalanceResponse resp = pointsService.grant(userId, amount, reason, ref);

        // balance 기준 자동 뱃지 지급
        for (BadgeType b : badgeTypeRepo.findByIsActiveTrueOrderByRequiredPointsAsc()) {
            if (resp.getBalance() >= b.getRequiredPoints()
                    && !userBadgeRepo.existsByUserIdAndBadgeIdAndIsRevokedFalse(userId, b.getBadgeId())) {
                badgeService.grantByCode(userId, b.getCode(), null);
            }
        }
        return resp;
    }
}