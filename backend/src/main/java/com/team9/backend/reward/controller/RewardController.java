package com.team9.backend.reward.controller;

import com.team9.backend.reward.dto.BalanceResponse;
import com.team9.backend.reward.dto.GrantPointRequest;
import com.team9.backend.reward.dto.ManualBadgeGrantRequest;
import com.team9.backend.reward.dto.RewardHistoryItem;
import com.team9.backend.reward.entity.BadgeType;
import com.team9.backend.reward.service.BadgeService;
import com.team9.backend.reward.service.PointService;
import com.team9.backend.reward.service.RewardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final PointService PointService;
    private final RewardService rewardService;
    private final BadgeService badgeService;

    @GetMapping("/points/{userId}")
    public BalanceResponse getPoints(@PathVariable Long userId) {
        return PointService.balance(userId);
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
        return PointService.history(userId);
    }

    @GetMapping("/check/{userId}")
    public BalanceResponse recheck(@PathVariable Long userId) {
        return rewardService.grantPointsAndAutoBadges(userId, 0, "recheck", null);
    }
}