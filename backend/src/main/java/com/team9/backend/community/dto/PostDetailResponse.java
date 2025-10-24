package com.team9.backend.community.dto;

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
    private final boolean isLikedByCurrentUser;

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
    }
}
