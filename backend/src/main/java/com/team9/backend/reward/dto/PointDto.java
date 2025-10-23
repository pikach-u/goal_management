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
public class PointDto {

    private Long userId;          // 사용자 ID
    private Long pointId;         // 포인트 PK (응답용)
    private Long amount;          // 지급 or 차감 포인트
    private String reason;        // 사유 (예: 게시글 작성 보상)
    private LocalDateTime createdAt;

    private Long balance;         // 현재 잔액
}