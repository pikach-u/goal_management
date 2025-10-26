package com.team9.backend.user.service;

import com.team9.backend.global.exception.ResourceNotFoundException;
import com.team9.backend.user.dto.UserRequest;
import com.team9.backend.user.dto.UserResponse;
import com.team9.backend.user.dto.UserUpdateResponse;
import com.team9.backend.user.entity.User;
import com.team9.backend.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    // User page
    // 기능: 개인정보 입력, 수정, 이미지 변경(기본부터), 목표 및 동기부여 공개범위 설정
    // 화면: 닉네임, 이메일, 자기소개, 기본 프로필 이미지, 동기부여 설정

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponse getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return toUserResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return toUserResponse(user);
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        // Repository에서 Page<User> 가져오기
        // Page<User> → Page<UserResponse> 변환
        return userRepository.findAll(pageable)
                .map(UserResponse::from);
    }

//    public UserResponse updateUserProfile(String userId, UserUpdateRequest request){
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
//
//        user.setBio(request.getContent());
//
//        return UserResponse.from(userRepository.save(user));
//    }
//
//    public UserResponse updateProfileImage(String userId, String imageUrl){
//
//    }
//
//    public UserResponse switchVisibilitySetting(String userId, UserUpdateResponse updateResponse){
//
//    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    private UserResponse toUserResponse(User user) {
        User currentUser = getCurrentUser();

        return UserResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .bio(user.getBio())
                .build();
    }

}
