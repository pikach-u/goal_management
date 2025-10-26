package com.team9.backend.community.dto;

import com.team9.backend.community.entity.Comment;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentResponse {
    private final Long commentNo;
    private final String content;
    private final String userNickname;
    private final LocalDateTime createDate;

    private CommentResponse(Comment comment) {
        this.commentNo = comment.getCommentNo();
        this.content = comment.getContent();

        if (comment.getUser() != null) {
            this.userNickname = comment.getUser().getUsername();
        } else {
            this.userNickname = "알 수 없는 사용자";
        }

        this.createDate = comment.getCreateDate();
    }

    public static CommentResponse of(Comment comment) {
        return new CommentResponse(comment);
    }
}


