package com.team9.backend.goal.service;

import com.team9.backend.goal.dto.GoalDto;
import com.team9.backend.goal.entity.Goal;
import com.team9.backend.goal.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

  private final GoalRepository goalRepository;

  // 목표 생성
  public GoalDto.Response createGoal(GoalDto.Request request) {
    Goal goal = Goal.builder()
        .goalName(request.getGoalName())
        .goalContent(request.getGoalContent())
        .startDate(request.getStartDate())
        .endDate(request.getEndDate())
        .status(request.getStatus())
        .build();

    Goal savedGoal = goalRepository.save(goal);
    return GoalDto.Response.fromEntity(savedGoal);
  }

  // 전체 목표 조회
  public List<GoalDto.Response> getAllGoals() {
    return goalRepository.findAll()
        .stream()
        .map(GoalDto.Response::fromEntity)
        .toList();
  }

  // 단일 목표 조회
  public GoalDto.Response getGoal(Long goalId) {
    Goal goal = goalRepository.findById(goalId)
        .orElseThrow(() -> new IllegalArgumentException("해당 목표가 존재하지 않습니다."));
    return GoalDto.Response.fromEntity(goal);
  }

  // 목표 수정
  public GoalDto.Response updateGoal(Long goalId, GoalDto.Request request) {
    Goal goal = goalRepository.findById(goalId)
        .orElseThrow(() -> new IllegalArgumentException("해당 목표가 존재하지 않습니다."));

    goal.setGoalName(request.getGoalName());
    goal.setGoalContent(request.getGoalContent());
    goal.setStartDate(request.getStartDate());
    goal.setEndDate(request.getEndDate());
    goal.setStatus(request.getStatus());

    Goal updatedGoal = goalRepository.save(goal);
    return GoalDto.Response.fromEntity(updatedGoal);
  }

  // 목표 삭제
  public void deleteGoal(Long goalId) {
    if (!goalRepository.existsById(goalId)) {
      throw new IllegalArgumentException("해당 목표가 존재하지 않습니다.");
    }
    goalRepository.deleteById(goalId);
  }
}
