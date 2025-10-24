package com.team9.backend.goal.dto;

import com.team9.backend.goal.entity.Goal;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class GoalDto {

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class Request {
    private String goalName;
    private String goalContent; // ✅ 엔티티와 이름 맞추기
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class Response {
    private Long goalId;
    private String goalName;
    private String goalContent;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static Response fromEntity(Goal goal) {
      return Response.builder()
          .goalId(goal.getGoalId())
          .goalName(goal.getGoalName())
          .goalContent(goal.getGoalContent())
          .startDate(goal.getStartDate())
          .endDate(goal.getEndDate())
          .status(goal.getStatus())
          .createdAt(goal.getCreatedAt())
          .updatedAt(goal.getUpdatedAt())
          .build();
    }
  }
}
