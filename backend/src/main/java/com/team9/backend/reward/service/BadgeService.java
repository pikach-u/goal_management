package com.pikachu.goal.reward.service;

import com.pikachu.goal.reward.entity.BadgeType;
import com.pikachu.goal.reward.entity.UserBadge;
import com.pikachu.goal.reward.repository.BadgeTypeRepository;
import com.pikachu.goal.reward.repository.UserBadgeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class BadgeService {

    private final BadgeTypeRepository badgeTypeRepo;
    private final UserBadgeRepository userBadgeRepo;

    @Transactional
    public void grantByCode(Long userId, String badgeCode, Long adminId) {
        BadgeType type = badgeTypeRepo.findByCodeAndIsActiveTrue(badgeCode)
                .orElseThrow(() -> new IllegalArgumentException("Unknown badgeCode"));
        if (userBadgeRepo.existsByUserIdAndBadgeIdAndIsRevokedFalse(userId, type.getBadgeId())) return;

        UserBadge ub = new UserBadge();
        ub.setUserId(userId);
        ub.setBadgeId(type.getBadgeId());
        ub.setAwardedBy(adminId);
        userBadgeRepo.save(ub);
    }

    @Transactional(readOnly = true)
    public List<BadgeType> list(Long userId) {
        var ubs = userBadgeRepo.findByUserIdAndIsRevokedFalse(userId);
        var map = badgeTypeRepo.findAllById(ubs.stream().map(UserBadge::getBadgeId).toList())
                .stream().collect(Collectors.toMap(BadgeType::getBadgeId, b -> b));
        return ubs.stream().map(ub -> map.get(ub.getBadgeId())).toList();
    }
}