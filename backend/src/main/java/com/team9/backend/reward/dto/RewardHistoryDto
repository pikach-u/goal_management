package com.team9.backend.reward.dto;

import com.team9.backend.reward.entity.RewardEnums.RewardType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardHistoryDto {

    private Long rewardId;
    private Long userId;
    private RewardType rewardType;  // POINT or BADGE
    private Long rewardValue;       // 지급 포인트 or 뱃지 ID
    private String reason;          // 보상 이유
    private LocalDateTime timestamp;
}