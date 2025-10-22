package com.pikachu.goal.reward.controller;

import com.pikachu.goal.reward.dto.BalanceResponse;
import com.pikachu.goal.reward.dto.GrantPointRequest;
import com.pikachu.goal.reward.dto.ManualBadgeGrantRequest;
import com.pikachu.goal.reward.dto.RewardHistoryItem;
import com.pikachu.goal.reward.entity.BadgeType;
import com.pikachu.goal.reward.service.BadgeService;
import com.pikachu.goal.reward.service.PointsService;
import com.pikachu.goal.reward.service.RewardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final PointsService pointsService;
    private final RewardService rewardService;
    private final BadgeService badgeService;

    @GetMapping("/points/{userId}")
    public BalanceResponse getPoints(@PathVariable Long userId) {
        return pointsService.balance(userId);
    }

    @PostMapping("/points/{userId}")
    public BalanceResponse grantPoints(@PathVariable Long userId,
                                       @RequestBody @Valid GrantPointRequest req) {
        return rewardService.grantPointsAndAutoBadges(userId, req.getAmount(), req.getReason(), req.getReferenceId());
    }

    @GetMapping("/badges/{userId}")
    public List<BadgeType> badges(@PathVariable Long userId) {
        return badgeService.list(userId);
    }

    @PostMapping("/badges/{userId}")
    public void grantBadge(@PathVariable Long userId,
                           @RequestBody @Valid ManualBadgeGrantRequest req) {
        badgeService.grantByCode(userId, req.getBadgeCode(), req.getAwardedBy());
    }

    @GetMapping("/history/{userId}")
    public List<RewardHistoryItem> history(@PathVariable Long userId) {
        return pointsService.history(userId);
    }

    @GetMapping("/check/{userId}")
    public BalanceResponse recheck(@PathVariable Long userId) {
        return rewardService.grantPointsAndAutoBadges(userId, 0, "recheck", null);
    }
}