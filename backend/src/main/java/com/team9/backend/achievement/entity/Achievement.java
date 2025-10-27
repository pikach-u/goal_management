package com.team9.backend.achievement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.team9.backend.goal.entity.Goal;
import com.team9.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "achievements",
       uniqueConstraints = @UniqueConstraint(columnNames = {"goal_id", "achieved_date"}))
public class Achievement {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "achievement_id")
  private Long achievementId;

  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "goal_id", nullable = false)
  private Goal goal;

  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "achieved_date", nullable = false)
  private LocalDate achievedDate;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;
}
