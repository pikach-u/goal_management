package com.team9.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String username;
    private String email;
    private String bio;

    private String motivationType;
    private boolean goalVisibility;
    private boolean progressVisibility;

    private String accessToken;
    private String refreshToken;
}
