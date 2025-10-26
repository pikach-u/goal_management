package com.team9.backend.community.repository;

import com.team9.backend.community.entity.Post;
import com.team9.backend.community.entity.PostLike;
import com.team9.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {


    Optional<PostLike> findByUserAndPost(User user, Post post);

    boolean existsByUserAndPost(User user, Post post);
}
