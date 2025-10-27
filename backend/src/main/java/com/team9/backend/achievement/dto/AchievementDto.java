package com.team9.backend.achievement.dto;

import com.team9.backend.achievement.entity.Achievement;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AchievementDto {

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class Request {
    private LocalDate achievedDate;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class Response {
    private Long achievementId;
    private Long goalId;
    private LocalDate achievedDate;
    private LocalDateTime createdAt;

    public static Response fromEntity(Achievement achievement) {
      return Response.builder()
          .achievementId(achievement.getAchievementId())
          .goalId(achievement.getGoal().getGoalId())
          .achievedDate(achievement.getAchievedDate())
          .createdAt(achievement.getCreatedAt())
          .build();
    }
  }
}
