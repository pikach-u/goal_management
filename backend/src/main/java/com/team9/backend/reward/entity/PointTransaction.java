package com.team9.backend.reward.entity;

import com.team9.backend.reward.entity.RewardEnums.TransactionType;
import com.team9.backend.reward.entity.RewardEnums.TxStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "point_transaction")
@Getter @Setter @NoArgsConstructor
public class PointTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    private Long userId;
    private long amount;                           // +적립 / -차감
    @Enumerated(EnumType.STRING)
    private TransactionType type;                  // EARN, SPEND 등
    private String reason;                         // 지급 사유
    private String referenceId;                    // 게시글 등 연동 정보

    private LocalDateTime createdAt = LocalDateTime.now();
    private Long createdBy;                        // 관리자 ID (선택)
    @Enumerated(EnumType.STRING)
    private TxStatus status = TxStatus.COMPLETED;
}