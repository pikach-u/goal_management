package com.team9.backend.community.service;

import com.team9.backend.community.dto.PostDetailResponse;
import com.team9.backend.community.dto.PostLikeResponse;
import com.team9.backend.community.dto.PostRequest;
import com.team9.backend.community.dto.PostSimpleResponse;
import com.team9.backend.community.entity.Post;
import com.team9.backend.community.entity.PostLike;
import com.team9.backend.community.exception.PostNotFoundException; // PostNotFoundException이 필요합니다.
import com.team9.backend.community.repository.BoardRepository;
import com.team9.backend.community.repository.PostLikeRepository;
import com.team9.backend.goal.entity.Goal;
import com.team9.backend.goal.repository.GoalRepository;
import com.team9.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {

    private final BoardRepository boardRepository;
    private final PostLikeRepository postLikeRepository;
    private final GoalRepository goalRepository;

    //등록
    @Transactional
    public Post savePost(PostRequest requestDto, User user) {
        if (user == null) {
            throw new IllegalArgumentException("로그인이 필요한 기능입니다.");
        }

        Post post = new Post(requestDto.getPostTitle(), requestDto.getPostContent(), user);

        // Goal 연동 처리 (선택사항)
        if (requestDto.getGoalId() != null) {
            Goal goal = goalRepository.findById(requestDto.getGoalId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 목표입니다. ID: " + requestDto.getGoalId()));

            // 해당 Goal이 현재 사용자의 것인지 확인
            if (!goal.getUser().getUserId().equals(user.getUserId())) {
                throw new IllegalArgumentException("다른 사용자의 목표는 선택할 수 없습니다.");
            }

            post.setGoal(goal);
        }

        return boardRepository.save(post);
    }

    //목록
    public Page<PostSimpleResponse> findAllPosts(User user, Pageable pageable) {
        Page<Post> postPage = boardRepository.findAllByPostDeleteDateIsNullOrderByPostCreateDateDesc(pageable);
        return postPage.map(post -> {
            boolean isLiked = user != null && postLikeRepository.existsByUserAndPost(user, post);
            return new PostSimpleResponse(post, isLiked);
        });
    }

    //현재 사용자의 게시글 목록
    public Page<PostSimpleResponse> findMyPosts(User user, Pageable pageable) {
        if (user == null) {
            throw new IllegalArgumentException("로그인이 필요한 기능입니다.");
        }
        Page<Post> postPage = boardRepository.findByUserAndPostDeleteDateIsNullOrderByPostCreateDateDesc(user, pageable);
        return postPage.map(post -> {
            boolean isLiked = postLikeRepository.existsByUserAndPost(user, post);
            return new PostSimpleResponse(post, isLiked);
        });
    }

    //상세 조회
    @Transactional
    public PostDetailResponse findPostById(Long postNo, User user) {
        Post post = findPostOrThrow(postNo);
        post.incrementPostCount();

        boolean isLikedByCurrentUser = false;
        if (user != null) {
            isLikedByCurrentUser = postLikeRepository.existsByUserAndPost(user, post);
        }

        return new PostDetailResponse(post, isLikedByCurrentUser);
    }

    //수정
    @Transactional
    public Post updatePost(Long postNo, PostRequest requestDto, User user) {
        Post post = findPostOrThrow(postNo);
        validatePostAuthor(post, user);
        post.setPostTitle(requestDto.getPostTitle());
        post.setPostContent(requestDto.getPostContent());

        // Goal 연동 수정 처리
        if (requestDto.getGoalId() != null) {
            Goal goal = goalRepository.findById(requestDto.getGoalId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 목표입니다. ID: " + requestDto.getGoalId()));

            // 해당 Goal이 현재 사용자의 것인지 확인
            if (!goal.getUser().getUserId().equals(user.getUserId())) {
                throw new IllegalArgumentException("다른 사용자의 목표는 선택할 수 없습니다.");
            }

            post.setGoal(goal);
        } else {
            // goalId가 null이면 연결 해제
            post.setGoal(null);
        }

        return post;
    }

    //삭제
    @Transactional
    public void deletePost(Long postNo, User user) {
        Post post = findPostOrThrow(postNo);
        validatePostAuthor(post, user);
        post.setPostDeleteDate(LocalDateTime.now());
    }

    //검색
    public Page<PostSimpleResponse> searchPost(String keyword, User user, Pageable pageable) {
        Page<Post> postPage = boardRepository
                .findByPostDeleteDateIsNullAndPostTitleContainingOrPostContentContainingOrderByPostCreateDateDesc
                        (keyword, keyword, pageable);

        return postPage.map(post -> {
            boolean isLiked = user != null && postLikeRepository.existsByUserAndPost(user, post);
            return new PostSimpleResponse(post, isLiked);
        });
    }

    //좋아요
    @Transactional
    public PostLikeResponse togglePostLike(Long postNo, User user) {
        if (user == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }
        Post post = findPostOrThrow(postNo);

        Optional<PostLike> existingLike = postLikeRepository.findByUserAndPost(user, post);

        boolean isLiked;
        if (existingLike.isPresent()) {
            postLikeRepository.delete(existingLike.get());
            post.decrementLikeCount();
            isLiked = false;
        } else {
            PostLike newLike = new PostLike(user, post);
            postLikeRepository.save(newLike);
            post.incrementLikeCount();
            isLiked = true;
        }

        return new PostLikeResponse(isLiked, post.getPostLikeCount());
    }


    private Post findPostOrThrow(Long postNo) {
        return boardRepository.findById(postNo)
                .filter(post -> post.getPostDeleteDate() == null)
                .orElseThrow(() -> new PostNotFoundException("게시물을 찾을 수 없거나 삭제되었습니다. ID: " + postNo));
    }

    private void validatePostAuthor(Post post, User user) {
        if (user == null) {
            throw new IllegalArgumentException("로그인이 필요한 기능입니다.");
        }

        if (post.getUser() == null || !Objects.equals(post.getUser().getUserId(), user.getUserId())) {
            throw new IllegalStateException("이 게시물에 대한 수정/삭제 권한이 없습니다.");
        }
    }
}

