package com.team9.backend.community.repository;

import com.team9.backend.community.entity.Comment;
import com.team9.backend.community.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByPostAndDeleteDateIsNull(Post post, Pageable pageable);
}
