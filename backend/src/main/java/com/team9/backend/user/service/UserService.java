package com.team9.backend.user.service;

import com.team9.backend.user.dto.UserResponse;
import com.team9.backend.user.dto.UserUpdateResponse;
import com.team9.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // User page
    // 기능: 개인정보 입력, 수정, 이미지 변경(기본부터), 목표 및 동기부여 공개범위 설정
    // 화면: 닉네임, 이메일, 자기소개, 기본 프로필 이미지, 동기부여 설정

//    public UserResponse getUserProfile(UUID id){
//
//    }
//
//    public UserResponse updateUserProfile(UUID id, UserUpdateResponse updateResponse){
//
//    }
//
//    public UserResponse updateProfileImage(UUID id, String imageUrl){
//
//    }
//
//    public UserResponse switchVisibilitySetting(UUID id, UserUpdateResponse updateResponse){
//
//    }
}
