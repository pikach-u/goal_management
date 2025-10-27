package com.team9.backend.goal.repository;

import com.team9.backend.goal.entity.Goal;
import com.team9.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {

  // 특정 사용자의 모든 목표 조회
  List<Goal> findByUser(User user);

  // 특정 사용자의 특정 목표 조회
  Optional<Goal> findByGoalIdAndUser(Long goalId, User user);

  // 특정 사용자의 목표가 존재하는지 확인
  boolean existsByGoalIdAndUser(Long goalId, User user);
}
