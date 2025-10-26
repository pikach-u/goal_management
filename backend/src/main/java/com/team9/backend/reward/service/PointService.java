package com.team9.backend.reward.service;

import com.team9.backend.reward.dto.BalanceResponse;
import com.team9.backend.reward.dto.RewardHistoryItem;
import com.team9.backend.reward.entity.PointsBalance;
import com.team9.backend.reward.entity.PointTransaction;
import com.team9.backend.reward.entity.RewardEnums.TransactionType;
import com.team9.backend.reward.repository.PointBalanceRepository;
import com.team9.backend.reward.repository.PointTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service @RequiredArgsConstructor
public class PointService {

    private final PointBalanceRepository balanceRepo;
    private final PointTransactionRepository txRepo;

    @Transactional
    public BalanceResponse grant(Long userId, long amount, String reason, String ref) {
        PointTransaction tx = new PointTransaction();
        tx.setUserId(userId);
        tx.setAmount(amount);
        tx.setType(amount >= 0 ? TransactionType.EARN : TransactionType.SPEND);
        tx.setReason(reason);
        tx.setReferenceId(ref);
        tx.setCreatedAt(LocalDateTime.now());
        txRepo.save(tx);

        PointBalance bal = balanceRepo.findById(userId).orElseGet(() -> {
            PointBalance b = new PointBalance(); b.setUserId(userId); return b;
        });
        if (amount >= 0) bal.setEarnedPoints(bal.getEarnedPoints() + amount);
        else bal.setUsedPoints(bal.getUsedPoints() + Math.abs(amount));
        bal.setBalance(bal.getBalance() + amount);
        bal.setLastUpdated(LocalDateTime.now());
        balanceRepo.save(bal);

        return new BalanceResponse(bal.getBalance(), bal.getEarnedPoints(), bal.getUsedPoints());
    }

    @Transactional(readOnly = true)
    public BalanceResponse balance(Long userId) {
        PointBalance b = balanceRepo.findById(userId).orElseGet(() -> {
            PointBalance nb = new PointBalance(); nb.setUserId(userId); return nb;
        });
        return new BalanceResponse(b.getBalance(), b.getEarnedPoints(), b.getUsedPoints());
    }

    @Transactional(readOnly = true)
    public List<RewardHistoryItem> history(Long userId) {
        return txRepo.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .map(t -> new RewardHistoryItem(t.getTransactionId(), t.getAmount(), t.getType(),
                    t.getReason(), t.getReferenceId(), t.getCreatedAt()))
            .toList();
    }
}