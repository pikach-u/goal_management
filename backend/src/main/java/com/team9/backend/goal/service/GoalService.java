package com.team9.backend.goal.service;

import com.team9.backend.global.exception.ResourceNotFoundException;
import com.team9.backend.goal.dto.GoalDto;
import com.team9.backend.goal.entity.Goal;
import com.team9.backend.goal.repository.GoalRepository;
import com.team9.backend.user.entity.User;
import com.team9.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

  private final GoalRepository goalRepository;
  private final UserRepository userRepository;

  // 목표 생성 (현재 사용자의 목표로 생성)
  @Transactional
  public GoalDto.Response createGoal(GoalDto.Request request) {
    User currentUser = getCurrentUser();

    Goal goal = Goal.builder()
        .user(currentUser)
        .goalName(request.getGoalName())
        .goalContent(request.getGoalContent())
        .startDate(request.getStartDate())
        .endDate(request.getEndDate())
        .status(request.getStatus())
        .build();

    Goal savedGoal = goalRepository.save(goal);
    return GoalDto.Response.fromEntity(savedGoal);
  }

  // 현재 사용자의 전체 목표 조회
  @Transactional(readOnly = true)
  public List<GoalDto.Response> getAllGoals() {
    User currentUser = getCurrentUser();
    return goalRepository.findByUser(currentUser)
        .stream()
        .map(GoalDto.Response::fromEntity)
        .toList();
  }

  // 현재 사용자의 단일 목표 조회
  @Transactional(readOnly = true)
  public GoalDto.Response getGoal(Long goalId) {
    User currentUser = getCurrentUser();
    Goal goal = goalRepository.findByGoalIdAndUser(goalId, currentUser)
        .orElseThrow(() -> new ResourceNotFoundException("해당 목표가 존재하지 않거나 접근 권한이 없습니다."));
    return GoalDto.Response.fromEntity(goal);
  }

  // 현재 사용자의 목표 수정
  @Transactional
  public GoalDto.Response updateGoal(Long goalId, GoalDto.Request request) {
    User currentUser = getCurrentUser();
    Goal goal = goalRepository.findByGoalIdAndUser(goalId, currentUser)
        .orElseThrow(() -> new ResourceNotFoundException("해당 목표가 존재하지 않거나 접근 권한이 없습니다."));

    goal.setGoalName(request.getGoalName());
    goal.setGoalContent(request.getGoalContent());
    goal.setStartDate(request.getStartDate());
    goal.setEndDate(request.getEndDate());
    goal.setStatus(request.getStatus());

    Goal updatedGoal = goalRepository.save(goal);
    return GoalDto.Response.fromEntity(updatedGoal);
  }

  // 현재 사용자의 목표 삭제
  @Transactional
  public void deleteGoal(Long goalId) {
    User currentUser = getCurrentUser();
    if (!goalRepository.existsByGoalIdAndUser(goalId, currentUser)) {
      throw new ResourceNotFoundException("해당 목표가 존재하지 않거나 접근 권한이 없습니다.");
    }
    goalRepository.deleteById(goalId);
  }

  // 현재 인증된 사용자 조회
  private User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
  }
}
