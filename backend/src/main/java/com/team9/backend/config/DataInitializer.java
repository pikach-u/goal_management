package com.team9.backend.config;

import com.team9.backend.achievement.entity.Achievement;
import com.team9.backend.achievement.repository.AchievementRepository;
import com.team9.backend.community.entity.Post;
import com.team9.backend.community.repository.BoardRepository;
import com.team9.backend.goal.entity.Goal;
import com.team9.backend.goal.repository.GoalRepository;
import com.team9.backend.user.entity.User;
import com.team9.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final GoalRepository goalRepository;
    private final BoardRepository boardRepository;
    private final AchievementRepository achievementRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // 기존 데이터가 있으면 초기화하지 않음
        if (userRepository.count() > 0) {
            log.info("데이터가 이미 존재합니다. 초기화를 건너뜁니다.");
            return;
        }

        log.info("더미 데이터 초기화 시작...");

        // 1. 사용자 생성
        User user1 = createUser("user1", "user1@example.com", "password123");
        User user2 = createUser("user2", "user2@example.com", "password123");
        User user3 = createUser("user3", "user3@example.com", "password123");

        // 2. 목표 생성
        Goal goal1 = createGoal(user1, "매일 운동하기", "건강한 삶을 위해 매일 30분씩 운동",
                                LocalDate.now().minusDays(30), LocalDate.now().plusDays(30));
        Goal goal2 = createGoal(user1, "책 읽기", "한 달에 3권 읽기",
                                LocalDate.now().minusDays(15), LocalDate.now().plusDays(15));
        Goal goal3 = createGoal(user2, "영어 공부", "매일 영단어 50개 암기",
                                LocalDate.now().minusDays(20), LocalDate.now().plusDays(40));
        Goal goal4 = createGoal(user2, "프로젝트 완성", "개인 프로젝트 완성하기",
                                LocalDate.now().minusDays(10), LocalDate.now().plusDays(50));
        Goal goal5 = createGoal(user3, "다이어트", "5kg 감량하기",
                                LocalDate.now().minusDays(25), LocalDate.now().plusDays(35));

        // 3. 커뮤니티 게시글 생성
        createPost(user1, goal1, "30일 운동 챌린지 완료!",
                  "매일 30분씩 운동하는 목표를 30일간 달성했습니다! 처음에는 힘들었지만 점점 습관이 되어가는 것 같아요. 여러분도 함께 도전해보세요!");

        createPost(user1, goal2, "이번 달 읽은 책 추천",
                  "목표 달성을 위해 읽은 책 중 '아침 루틴의 힘'이 정말 도움이 되었습니다. 작은 습관의 중요성을 깨달았어요.");

        createPost(user2, goal3, "영어 공부 방법 공유",
                  "매일 영단어 50개를 암기하는 게 쉽지 않았는데, 앱을 활용하니 훨씬 수월해졌어요. Anki라는 앱 추천드립니다!");

        createPost(user2, goal4, "프로젝트 중간 점검",
                  "개인 프로젝트 진행 중인데 생각보다 시간이 많이 걸리네요. 하지만 하나씩 완성해가는 재미가 있습니다!");

        createPost(user3, goal5, "다이어트 2주차 후기",
                  "다이어트 시작한 지 2주가 지났습니다. 아직 많이 빠지진 않았지만 꾸준히 하는 게 중요한 것 같아요. 같이 응원해요!");

        createPost(user1, null, "목표 관리의 중요성",
                  "목표를 설정하고 관리하면서 삶이 훨씬 체계적으로 변한 것 같아요. 여러분도 작은 목표부터 시작해보세요!");

        createPost(user2, null, "커뮤니티에 처음 가입했어요",
                  "안녕하세요! 오늘 처음 가입했습니다. 목표를 달성하기 위해 함께 노력하는 분들이 많아서 좋네요. 잘 부탁드립니다!");

        createPost(user3, null, "목표 달성 팁 공유",
                  "제가 목표를 달성하면서 느낀 점은 '작게 시작하기'입니다. 너무 큰 목표보다는 작고 달성 가능한 목표부터 세우는 게 좋은 것 같아요.");

        // 4. 달성 기록 생성 (최근 날짜들에 대해)
        createAchievementsForGoal(goal1, 15); // 지난 15일 중 랜덤하게 달성
        createAchievementsForGoal(goal2, 8);  // 지난 8일 중 랜덤하게 달성
        createAchievementsForGoal(goal3, 12); // 지난 12일 중 랜덤하게 달성
        createAchievementsForGoal(goal4, 6);  // 지난 6일 중 랜덤하게 달성
        createAchievementsForGoal(goal5, 10); // 지난 10일 중 랜덤하게 달성

        log.info("더미 데이터 초기화 완료!");
        log.info("생성된 사용자: {}", userRepository.count());
        log.info("생성된 목표: {}", goalRepository.count());
        log.info("생성된 게시글: {}", boardRepository.count());
        log.info("생성된 달성 기록: {}", achievementRepository.count());
    }

    private User createUser(String username, String email, String password) {
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role("ROLE_USER")
                .provider(com.team9.backend.auth.entity.AuthProvider.LOCAL)
                .enabled(true)
                .build();
        return userRepository.save(user);
    }

    private Goal createGoal(User user, String name, String content, LocalDate startDate, LocalDate endDate) {
        Goal goal = Goal.builder()
                .goalName(name)
                .goalContent(content)
                .startDate(startDate)
                .endDate(endDate)
                .status("진행중")
                .user(user)
                .build();
        return goalRepository.save(goal);
    }

    private Post createPost(User user, Goal goal, String title, String content) {
        Post post = new Post(title, content, user);
        if (goal != null) {
            post.setGoal(goal);
        }
        return boardRepository.save(post);
    }

    private void createAchievementsForGoal(Goal goal, int daysToCreate) {
        LocalDate today = LocalDate.now();

        // 목표 시작일과 오늘 중 더 늦은 날짜부터 시작
        LocalDate startDate = goal.getStartDate().isAfter(today.minusDays(daysToCreate))
                              ? goal.getStartDate()
                              : today.minusDays(daysToCreate);

        // 목표 종료일과 어제 중 더 이른 날짜까지
        LocalDate endDate = goal.getEndDate().isBefore(today.minusDays(1))
                            ? goal.getEndDate()
                            : today.minusDays(1);

        // 날짜 범위 내에서 달성 기록 생성
        LocalDate currentDate = startDate;
        int created = 0;

        while (!currentDate.isAfter(endDate) && created < daysToCreate) {
            // 70% 확률로 달성 기록 생성 (랜덤하게)
            if (Math.random() < 0.7) {
                Achievement achievement = Achievement.builder()
                        .goal(goal)
                        .user(goal.getUser())
                        .achievedDate(currentDate)
                        .build();
                achievementRepository.save(achievement);
                created++;
            }
            currentDate = currentDate.plusDays(1);
        }
    }
}
