package com.team9.backend.goal.repository;

import com.team9.backend.goal.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoalRepository extends JpaRepository<Goal, Long> {

}
