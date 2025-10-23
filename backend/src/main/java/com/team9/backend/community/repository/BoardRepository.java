package com.team9.backend.community.repository;

import com.team9.backend.community.entity.Post;
import jakarta.persistence.Id;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByPostDeleteDateIsNullOrderByPostCreateDateDesc(Pageable pageable);

    Page<Post> findByPostDeleteDateIsNullAndPostTitleContainingOrPostContentContainingOrderByPostCreateDateDesc
            (String postTitle, String postContent, Pageable pageable); //String userNickname);

}
