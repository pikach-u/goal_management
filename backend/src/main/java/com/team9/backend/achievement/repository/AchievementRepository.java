package com.team9.backend.achievement.repository;

import com.team9.backend.achievement.entity.Achievement;
import com.team9.backend.goal.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {

  // 특정 목표의 모든 달성 기록 조회
  List<Achievement> findByGoal(Goal goal);

  // 특정 목표의 특정 날짜 달성 기록 조회
  Optional<Achievement> findByGoalAndAchievedDate(Goal goal, LocalDate achievedDate);

  // 특정 목표의 특정 날짜에 달성 기록이 있는지 확인
  boolean existsByGoalAndAchievedDate(Goal goal, LocalDate achievedDate);

  // 특정 목표의 달성 기록 개수
  long countByGoal(Goal goal);
}
