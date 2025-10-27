package com.team9.backend.community.repository;

import com.team9.backend.community.dto.PostDetailResponse;
import com.team9.backend.community.dto.PostSimpleResponse;
import com.team9.backend.community.entity.Post;
import com.team9.backend.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Post, Long> {

    Page<Post> findAllByPostDeleteDateIsNullOrderByPostCreateDateDesc(Pageable pageable);

    Page<Post> findByPostDeleteDateIsNullAndPostTitleContainingOrPostContentContainingOrderByPostCreateDateDesc
            (String postTitle, String postContent, Pageable pageable);

    // 특정 사용자의 게시글 조회 (삭제되지 않은 것만)
    Page<Post> findByUserAndPostDeleteDateIsNullOrderByPostCreateDateDesc(User user, Pageable pageable);

}
