package com.team9.backend.goal.controller;

import com.team9.backend.goal.dto.GoalDto;
import com.team9.backend.goal.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

  private final GoalService goalService;

  // 목표 생성
  @PostMapping
  public ResponseEntity<GoalDto.Response> createGoal(@RequestBody GoalDto.Request request) {
    GoalDto.Response response = goalService.createGoal(request);
    return ResponseEntity.ok(response);
  }

  // 전체 목표 조회
  @GetMapping
  public ResponseEntity<List<GoalDto.Response>> getAllGoals() {
    List<GoalDto.Response> goals = goalService.getAllGoals();
    return ResponseEntity.ok(goals);
  }

  // 단일 목표 조회
  @GetMapping("/{goalId}")
  public ResponseEntity<GoalDto.Response> getGoal(@PathVariable Long goalId) {
    GoalDto.Response response = goalService.getGoal(goalId);
    return ResponseEntity.ok(response);
  }

  // 목표 수정
  @PutMapping("/{goalId}")
  public ResponseEntity<GoalDto.Response> updateGoal(
      @PathVariable Long goalId,
      @RequestBody GoalDto.Request request) {
    GoalDto.Response response = goalService.updateGoal(goalId, request);
    return ResponseEntity.ok(response);
  }

  // 목표 삭제
  @DeleteMapping("/{goalId}")
  public ResponseEntity<Void> deleteGoal(@PathVariable Long goalId) {
    goalService.deleteGoal(goalId);
    return ResponseEntity.noContent().build();
  }
}
