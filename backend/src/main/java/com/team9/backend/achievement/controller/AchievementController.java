package com.team9.backend.achievement.controller;

import com.team9.backend.achievement.dto.AchievementDto;
import com.team9.backend.achievement.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/goals/{goalId}/achievements")
@RequiredArgsConstructor
public class AchievementController {

  private final AchievementService achievementService;

  // 특정 목표의 모든 달성 기록 조회
  @GetMapping
  public ResponseEntity<List<AchievementDto.Response>> getAchievements(@PathVariable Long goalId) {
    List<AchievementDto.Response> achievements = achievementService.getAchievementsByGoal(goalId);
    return ResponseEntity.ok(achievements);
  }

  // 달성 기록 추가
  @PostMapping
  public ResponseEntity<AchievementDto.Response> createAchievement(
      @PathVariable Long goalId,
      @RequestBody AchievementDto.Request request) {
    AchievementDto.Response response = achievementService.createAchievement(goalId, request);
    return ResponseEntity.ok(response);
  }

  // 달성 기록 삭제 (특정 날짜)
  @DeleteMapping("/{achievedDate}")
  public ResponseEntity<Void> deleteAchievement(
      @PathVariable Long goalId,
      @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate achievedDate) {
    achievementService.deleteAchievement(goalId, achievedDate);
    return ResponseEntity.noContent().build();
  }
}
