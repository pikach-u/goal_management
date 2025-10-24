package com.team9.backend.community.service;

import com.team9.backend.community.dto.CommentRequest;
import com.team9.backend.community.dto.CommentResponse;
import com.team9.backend.community.entity.Comment;
import com.team9.backend.community.entity.Post;
import com.team9.backend.community.exception.PostNotFoundException;
import com.team9.backend.community.repository.BoardRepository;
import com.team9.backend.community.repository.CommentRepository;
import com.team9.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;

    //등록
    @Transactional
    public CommentResponse createComment(Long postNo, CommentRequest requestDto, User user) {
        if (user == null) {
            throw new IllegalArgumentException("로그인이 필요한 기능입니다.");
        }

        Post post = findPostOrThrow(postNo);

        Comment comment = new Comment(
                requestDto.getContent(),
                post,
                user
        );

        Comment savedComment = commentRepository.save(comment);
        return CommentResponse.of(savedComment);
    }

    //목록
    public Page<CommentResponse> getComments(Long postNo, Pageable pageable) {
        Post post = findPostOrThrow(postNo);
        Page<Comment> commentPage = commentRepository.findByPostAndDeleteDateIsNull(post, pageable);
        return commentPage.map(CommentResponse::of);
    }

    //수정
    @Transactional
    public CommentResponse updateComment(Long postNo, Long commentNo, CommentRequest requestDto, User user) {
        Post post = findPostOrThrow(postNo);
        Comment comment = findCommentOrThrow(commentNo);

        if (!comment.getPost().getPost().equals(post.getPost())) {
            throw new IllegalArgumentException("해당 게시물의 댓글이 아닙니다.");
        }

        validateCommentAuthor(comment, user);

        comment.setContent(requestDto.getContent());
        return CommentResponse.of(comment); // Dirty checking으로 자동 저장됨
    }

    //삭제
    @Transactional
    public void deleteComment(Long postNo, Long commentNo, User user) {
        Post post = findPostOrThrow(postNo);
        Comment comment = findCommentOrThrow(commentNo);

        if (!comment.getPost().getPost().equals(post.getPost())) {
            throw new IllegalArgumentException("해당 게시물의 댓글이 아닙니다.");
        }

        validateCommentAuthor(comment, user);

        comment.setDeleteDate(LocalDateTime.now());
    }


    private Post findPostOrThrow(Long postNo) {
        return boardRepository.findById(postNo)
                .filter(post -> post.getPostDeleteDate() == null)
                .orElseThrow(() -> new PostNotFoundException("게시물을 찾을 수 없거나 삭제되었습니다. ID: " + postNo));
    }


    private Comment findCommentOrThrow(Long commentNo) {
        return commentRepository.findById(commentNo)
                .filter(comment -> comment.getDeleteDate() == null)
                .orElseThrow(() -> new PostNotFoundException("댓글을 찾을 수 없거나 삭제되었습니다. ID: " + commentNo));
    }

    private void validateCommentAuthor(Comment comment, User user) {
        if (user == null) {
            throw new IllegalArgumentException("로그인이 필요한 기능입니다.");
        }

        if (comment.getUser() == null || !Objects.equals(comment.getUser().getUserId(), user.getUserId())) {
            throw new IllegalStateException("이 댓글에 대한 수정/삭제 권한이 없습니다.");
        }
    }
}