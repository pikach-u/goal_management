package com.team9.backend.achievement.service;

import com.team9.backend.achievement.dto.AchievementDto;
import com.team9.backend.achievement.entity.Achievement;
import com.team9.backend.achievement.repository.AchievementRepository;
import com.team9.backend.global.exception.ResourceNotFoundException;
import com.team9.backend.goal.entity.Goal;
import com.team9.backend.goal.repository.GoalRepository;
import com.team9.backend.user.entity.User;
import com.team9.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchievementService {

  private final AchievementRepository achievementRepository;
  private final GoalRepository goalRepository;
  private final UserRepository userRepository;

  // 특정 목표의 모든 달성 기록 조회
  @Transactional(readOnly = true)
  public List<AchievementDto.Response> getAchievementsByGoal(Long goalId) {
    User currentUser = getCurrentUser();
    Goal goal = goalRepository.findByGoalIdAndUser(goalId, currentUser)
        .orElseThrow(() -> new ResourceNotFoundException("해당 목표가 존재하지 않거나 접근 권한이 없습니다."));

    return achievementRepository.findByGoal(goal)
        .stream()
        .map(AchievementDto.Response::fromEntity)
        .collect(Collectors.toList());
  }

  // 달성 기록 추가 (오늘 날짜)
  @Transactional
  public AchievementDto.Response createAchievement(Long goalId, AchievementDto.Request request) {
    User currentUser = getCurrentUser();
    Goal goal = goalRepository.findByGoalIdAndUser(goalId, currentUser)
        .orElseThrow(() -> new ResourceNotFoundException("해당 목표가 존재하지 않거나 접근 권한이 없습니다."));

    LocalDate achievedDate = request.getAchievedDate();

    // 이미 해당 날짜에 달성 기록이 있는지 확인
    if (achievementRepository.existsByGoalAndAchievedDate(goal, achievedDate)) {
      throw new IllegalArgumentException("해당 날짜에 이미 달성 기록이 존재합니다.");
    }

    Achievement achievement = Achievement.builder()
        .goal(goal)
        .user(currentUser)
        .achievedDate(achievedDate)
        .build();

    Achievement savedAchievement = achievementRepository.save(achievement);
    return AchievementDto.Response.fromEntity(savedAchievement);
  }

  // 달성 기록 삭제 (특정 날짜)
  @Transactional
  public void deleteAchievement(Long goalId, LocalDate achievedDate) {
    User currentUser = getCurrentUser();
    Goal goal = goalRepository.findByGoalIdAndUser(goalId, currentUser)
        .orElseThrow(() -> new ResourceNotFoundException("해당 목표가 존재하지 않거나 접근 권한이 없습니다."));

    Achievement achievement = achievementRepository.findByGoalAndAchievedDate(goal, achievedDate)
        .orElseThrow(() -> new ResourceNotFoundException("해당 날짜의 달성 기록이 존재하지 않습니다."));

    achievementRepository.delete(achievement);
  }

  // 현재 인증된 사용자 조회
  private User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
  }
}
