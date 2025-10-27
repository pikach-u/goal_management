package com.team9.backend.goal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.team9.backend.achievement.entity.Achievement;
import com.team9.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "goals")
public class Goal {
  @Id
  @Column(name = "goal_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long goalId;

  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "goal_name", nullable = false)
  private String goalName;

  @Column(name = "goal_content", columnDefinition = "TEXT", nullable = false)
  private String goalContent;

  @Column(name = "start_date", nullable = false)
  private LocalDate startDate;

  @Column(name = "end_date", nullable = false)
  private LocalDate endDate;

  @Column(nullable = false)
  private String status;

  @JsonIgnore
  @OneToMany(mappedBy = "goal", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Achievement> achievements = new ArrayList<>();

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

}
