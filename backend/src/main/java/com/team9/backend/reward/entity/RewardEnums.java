package com.team9.backend.reward.entity;

public final class RewardEnums {

    private RewardEnums() {} // 인스턴스화 방지

    public enum RewardType {
        POINT, BADGE
    }

    public enum TransactionType {
        EARN, SPEND, ADJUST, REFUND
    }

    public enum TxStatus {
        COMPLETED, PENDING, CANCELLED
    }
}