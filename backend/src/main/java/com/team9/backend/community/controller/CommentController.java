package com.team9.backend.community.controller;

import com.team9.backend.community.dto.CommentRequest;
import com.team9.backend.community.dto.CommentResponse;
import com.team9.backend.community.dto.PostLikeResponse;
import com.team9.backend.community.service.BoardService;
import com.team9.backend.community.service.CommentService;
import com.team9.backend.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postNo}/comments") 
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final BoardService boardService;

    //등록
    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long postNo,
            @Valid @RequestBody CommentRequest requestDto,
            @AuthenticationPrincipal User user) {
        
        CommentResponse response = commentService.createComment(postNo, requestDto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //조회
    @GetMapping
    public ResponseEntity<Page<CommentResponse>> getComments(
            @PathVariable Long postNo,
            Pageable pageable) {

        Page<CommentResponse> responsePage = commentService.getComments(postNo, pageable);
        return ResponseEntity.ok(responsePage);
    }

    //수정
    @PatchMapping("/{commentNo}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long postNo,
            @PathVariable Long commentNo,
            @Valid @RequestBody CommentRequest requestDto,
            @AuthenticationPrincipal User user) {

        CommentResponse response = commentService.updateComment(postNo, commentNo, requestDto, user);
        return ResponseEntity.ok(response);
    }

    //삭제
    @DeleteMapping("/{commentNo}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long postNo,
            @PathVariable Long commentNo,
            @AuthenticationPrincipal User user) {

        commentService.deleteComment(postNo, commentNo, user);
        return ResponseEntity.noContent().build();
    }

    //좋아요 // postNo 중복사용으로 인한 오류, 잠시 주석 처리 해두었습니다
//    @PostMapping("/{postNo}/like")
//    public ResponseEntity<PostLikeResponse> toggleLike(@PathVariable Long postNo,
//                                                       @AuthenticationPrincipal User user) {
//        PostLikeResponse response = boardService.togglePostLike(postNo, user);
//        return ResponseEntity.ok(response);
//    }
}

