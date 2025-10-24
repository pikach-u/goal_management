package com.team9.backend.community.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostLikeResponse {

    private boolean isLiked;
    private int likeCount;
}