package com.team9.backend.community.dto;

import com.team9.backend.community.entity.Post;
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

    public PostSimpleResponse(Post post) {
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
    }
}



