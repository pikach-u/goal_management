package com.team9.backend.community.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequest {

    @NotBlank(message = "제목을 입력해주세요")
    private String postTitle;

    @NotBlank(message = "내용을 입력해주세요")
    private String postContent;
    //private String userNickname;
}
