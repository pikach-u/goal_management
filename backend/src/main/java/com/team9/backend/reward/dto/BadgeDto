package com.team9.backend.reward.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BadgeDto {

    private Long badgeId;            // 뱃지 ID
    private String name;             // 뱃지 이름
    private String description;      // 설명
    private String iconUrl;          // 아이콘 경로
    private Long requiredPoints;     // 수여 기준 포인트
    private LocalDateTime createdAt; // 생성일

    private LocalDateTime awardedAt; // 수여 일자
    private Boolean isRevoked;       // 취소 여부
}