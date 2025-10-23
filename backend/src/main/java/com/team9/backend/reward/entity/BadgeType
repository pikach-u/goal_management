package com.team9.backend.reward.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "badge_type")
@Getter @Setter @NoArgsConstructor
public class BadgeType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long badgeId;

    @Column(unique = true, nullable = false)
    private String code;               // 내부 코드 (예: STARTER_100)
    @Column(nullable = false)
    private String name;               // 사용자에게 보여줄 이름
    private String description;        // 설명
    private String iconUrl;            // 아이콘 이미지 경로

    private Long requiredPoints = 0L;  // 자동 지급 기준 포인트
    private Boolean isActive = true;   // 비활성화 여부
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}