package com.team9.backend.community.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.team9.backend.community.entity.Post;
import com.team9.backend.user.entity.User;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PostSimpleResponse {

    private final Long postNo;
    private final String postTitle;
    private final String userNickname;
    private final LocalDateTime createDate;
    private final int viewCount;
    private final int commentCount;
    private final int likeCount;
    private final Long goalId;
    private final String goalTitle;

    @JsonProperty("isLikedByCurrentUser")
    private final boolean isLikedByCurrentUser;

    // 기본 생성자 (좋아요 정보 없음)
    public PostSimpleResponse(Post post) {
        this(post, null);
    }

    // 좋아요 정보 포함 생성자
    public PostSimpleResponse(Post post, Boolean isLikedByCurrentUser) {
        this.postNo = post.getPost();
        this.postTitle = post.getPostTitle();

        if (post.getUser() != null) {
            this.userNickname = post.getUser().getUsername();
        } else {
            this.userNickname = "알 수 없는 사용자";
        }

        this.createDate = post.getPostCreateDate();
        this.viewCount = post.getPostCount();
        this.commentCount = (post.getComments() != null) ? post.getComments().size() : 0;
        this.likeCount = post.getPostLikeCount();

        // Goal 정보 추가
        if (post.getGoal() != null) {
            this.goalId = post.getGoal().getGoalId();
            this.goalTitle = post.getGoal().getGoalName();
        } else {
            this.goalId = null;
            this.goalTitle = null;
        }

        // 좋아요 정보
        this.isLikedByCurrentUser = isLikedByCurrentUser != null ? isLikedByCurrentUser : false;
    }
}



