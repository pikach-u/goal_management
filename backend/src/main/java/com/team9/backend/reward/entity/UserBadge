package com.team9.backend.reward.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_badge")
@Getter @Setter @NoArgsConstructor
public class UserBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userBadgeId;

    private Long userId;                 // 사용자 ID
    private Long badgeId;                // 획득한 뱃지 ID

    private Long awardedBy;              // 수여자(관리자)
    private LocalDateTime awardedAt = LocalDateTime.now();

    private Boolean isRevoked = false;   // 취소 여부
    private LocalDateTime revokedAt;
    private String revokedReason;
}