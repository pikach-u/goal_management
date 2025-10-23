package com.team9.backend.reward.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "point_balance")
@Getter @Setter @NoArgsConstructor
public class PointBalance {

    @Id
    private Long userId;              // User 엔티티의 PK와 동일 (식별 관계)
    private long balance;             // 현재 잔액
    private long earnedPoints;        // 누적 적립 포인트
    private long usedPoints;          // 누적 사용 포인트
    private LocalDateTime lastUpdated = LocalDateTime.now();
}