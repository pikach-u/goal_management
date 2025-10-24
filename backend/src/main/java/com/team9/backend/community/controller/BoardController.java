package com.team9.backend.community.controller;

import com.team9.backend.community.dto.PostDetailResponse;
import com.team9.backend.community.dto.PostRequest;
import com.team9.backend.community.dto.PostSimpleResponse;
import com.team9.backend.community.entity.Post;
import com.team9.backend.community.service.BoardService;
import com.team9.backend.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Valid
@RestController
@RequiredArgsConstructor // 생성자 주입을 위해 추가
@RequestMapping("/api/posts")
public class BoardController {

    private final BoardService boardService;

    //등록
    @PostMapping
    public ResponseEntity<PostSimpleResponse> createPost(
            @Valid @RequestBody PostRequest requestDto,
            @AuthenticationPrincipal User user) {

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Post post = boardService.savePost(requestDto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(new PostSimpleResponse(post));
    }

    //조회 검색
    @GetMapping
    public Page<PostSimpleResponse> getAllPosts(
            @RequestParam(name = "keyword", required = false) String keyword,
            Pageable pageable){

        if(keyword != null && !keyword.trim().isEmpty()){
            return boardService.searchPost(keyword,pageable);
        }else{
            return boardService.findAllPosts(pageable);
        }
    }

    //게시물 상세
    @GetMapping("/{postNo}")
    public ResponseEntity<PostDetailResponse> getPost(@PathVariable Long postNo,
                                                      @AuthenticationPrincipal User user) {
        PostDetailResponse response = boardService.findPostById(postNo, user);
        return ResponseEntity.ok(response);
    }

    //수정
    @PatchMapping("/{postNo}")
    public ResponseEntity<PostSimpleResponse> updatePost(
            @PathVariable Long postNo,
            @Valid @RequestBody PostRequest requestDto,
            @AuthenticationPrincipal User user) {

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Post post = boardService.updatePost(postNo, requestDto, user);
        return ResponseEntity.ok(new PostSimpleResponse(post));
    }

    //삭제
    @DeleteMapping("/{postNo}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long postNo,
            @AuthenticationPrincipal User user) {

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boardService.deletePost(postNo, user);
        return ResponseEntity.noContent().build();
    }
}

