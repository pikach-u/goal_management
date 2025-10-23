package com.team9.backend.community.service;

import com.team9.backend.community.exception.AuthorMismatchException;
import com.team9.backend.community.exception.PostNotFoundException;
import com.team9.backend.community.repository.BoardRepository;

import com.team9.backend.community.dto.PostRequest;
import com.team9.backend.community.entity.Post;
import com.team9.backend.community.repository.BoardRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class BoardService {

    private final BoardRepository boardRepository;
    //private final UserRepository userRepository;

    //UserRepository 주입 예정

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
        //this.userRepository = userRepository;
    }

    //User user = userRepository.findByUserId(requestDto.getUserId())
    //        .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다. ID: " + requestDto.getUserId()));

    //등록
    @Transactional
    public Post savePost(PostRequest requestDto){

        //User user = userRepository.findByUserId(requestDto.getUserId())
               // .orElseThrow(() -> new PostNotFoundException("해당 유저를 찾을 수 없습니다. ID: " + requestDto.getUserId()));

        Post post = new Post();
        post.setPostTitle(requestDto.getPostTitle());
        post.setPostContent(requestDto.getPostContent());

       // post.setUser(user);

        return boardRepository.save(post);
    }

    //목록 조회
    public List<Post> findAllPosts(Pageable pageable){
        return boardRepository.findAllByPostDeleteDateIsNullOrderByPostCreateDateDesc(pageable);
    }


    //상세 조회
    @Transactional
    public Post findPostById(Long postNo){

        Post post = boardRepository.findById(postNo).orElseThrow(() -> new PostNotFoundException("잘못된 경로입니다"));
        //조회수
        post.incrementPostCount();
        return post;
    }

    //수정
    @Transactional
    public Post updatePost(Long postNo, String newTitle, String newContent) {
        Post post = boardRepository.findById(postNo).orElseThrow(() -> new PostNotFoundException("잘못된 경로입니다"));

        //권한 확인 로직 추가 예정

        post.setPostTitle(newTitle);
        post.setPostContent(newContent);

        return post;
    }

    //삭제
    public void deletePost(Long postNo){
        Post post = boardRepository.findById(postNo)
                .orElseThrow(() -> new PostNotFoundException("잘못된 접근입니다"));

        post.setPostDeleteDate(LocalDateTime.now());
    }

    //검색
    public Page<Post> searchPost(String keyword, Pageable pageable){
        return boardRepository.
                findByPostDeleteDateIsNullAndPostTitleContainingOrPostContentContainingOrderByPostCreateDateDesc
                        (keyword, keyword, pageable);
    }
}
