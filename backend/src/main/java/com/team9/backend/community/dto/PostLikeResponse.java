package com.team9.backend.community.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostLikeResponse {

    @JsonProperty("isLiked")
    private boolean isLiked;
    private int likeCount;
}