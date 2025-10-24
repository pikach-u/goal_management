package com.team9.backend.user.dto;

import com.team9.backend.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String userId;
    private String username;
    private String email;
    private String bio;

    private String profileImageUrl;

    private String motivationType;
    private boolean goalVisibility;
    private boolean progressVisibility;

    private String accessToken;
    private String refreshToken;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                //.profileImageUrl(user.getProfileImageUrl())
                .bio(user.getBio())
                .build();
    }
}
