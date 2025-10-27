package com.team9.backend.community.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.team9.backend.community.entity.Post;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PostDetailResponse {

    private final Long postNo;
    private final String postTitle;
    private final String postContent;
    private final String userNickname;
    private final LocalDateTime createDate;
    private final int viewCount;
    private final int likeCount;

    @JsonProperty("isLikedByCurrentUser")
    private final boolean isLikedByCurrentUser;

    private final Long goalId;
    private final String goalTitle;

    public PostDetailResponse(Post post, boolean isLikedByCurrentUser) {
        this.postNo = post.getPost();
        this.postTitle = post.getPostTitle();
        this.postContent = post.getPostContent();

        if (post.getUser() != null) {
            this.userNickname = post.getUser().getUsername();
        } else {
            this.userNickname = "알 수 없는 사용자";
        }

        this.createDate = post.getPostCreateDate();
        this.viewCount = post.getPostCount();
        this.likeCount = post.getPostLikeCount();
        this.isLikedByCurrentUser = isLikedByCurrentUser;

        // Goal 정보 추가
        if (post.getGoal() != null) {
            this.goalId = post.getGoal().getGoalId();
            this.goalTitle = post.getGoal().getGoalName();
        } else {
            this.goalId = null;
            this.goalTitle = null;
        }
    }
}
