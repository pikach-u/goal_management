package com.team9.backend.user.controller;

import com.team9.backend.user.dto.UserResponse;
import com.team9.backend.user.entity.User;
import com.team9.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
//    private final PostService postService;

    //UUID x username o

    // 모든 유저 조회 - Admin
    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size
            ){
        Pageable pageable = PageRequest.of(page, size);
        Page<UserResponse> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    // 특정 유저 조회
    @GetMapping("/{userid}")
    public ResponseEntity<UserResponse> getUserByUserId(@PathVariable String userId){
        UserResponse user = userService.getUserProfile(userId);
        return ResponseEntity.ok(user);
    }

//    // 유저 정보 수정
//    @PutMapping("/{userid}")
//    public ResponseEntity<UserResponse> updateProfile(
//            @PathVariable String userId,
//            @Valid @RequestBody UserRequest request,
//            @AuthenticationPrincipal UserDetails userDetails) {
//        UserResponse response = userService.updateUserProfile(userId, request, userDetails.getUsername());
//        return ResponseEntity.ok(response);
//    }

//    // 특정 유저의 작성글 보기
//    @GetMapping("/{userid}/posts")
//    public ResponseEntity<Page<PostResponse>> getUserPosts(@PathVariable String userId){
//        PostResponse response = postService.getUserPosts(userId);
//        return ResponseEntity.ok(response);
//    }

//    // 검색
//    @GetMapping("?keyword=\"username\"")




}
