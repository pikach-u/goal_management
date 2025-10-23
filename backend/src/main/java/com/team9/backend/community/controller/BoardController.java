package com.team9.backend.community.controller;

import com.team9.backend.community.dto.PostRequest;
import com.team9.backend.community.entity.Post;
import com.team9.backend.community.service.BoardService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Valid
@RestController
@RequestMapping("/api/posts")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    //등록
    @PostMapping
    public Post createPost(@RequestBody PostRequest requestDto){
        return boardService.savePost(requestDto);
    }

    //조회, 검색
    @GetMapping
    public Page<Post> getAllPosts(@RequestParam(name = "keyword", required = false) String keyword, Pageable pageable){

        if(keyword != null && !keyword.trim().isEmpty()){
            return boardService.searchPost(keyword,pageable);
        }else{
            return boardService.findAllPosts(pageable);
        }
    }

    //상세 조회
    @GetMapping("/{postNo}")
    public Post getPost(@PathVariable Long postNo){
        return boardService.findPostById(postNo);
    }

    //수정
    @PatchMapping("/{postNo}")
    public Post updatePost(@PathVariable Long postNo, @RequestBody PostRequest requestDto){
        return boardService.updatePost(postNo, requestDto.getPostTitle(), requestDto.getPostContent());
    }

    //삭제
    @DeleteMapping("/{postNo}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postNo){
        boardService.deletePost(postNo);
        return ResponseEntity.noContent().build();
    }

}
