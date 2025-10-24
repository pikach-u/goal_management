package com.team9.backend.user.repository;

import com.team9.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    //Email로 User 찾기
    Optional<User> findByEmail(String email);

    //닉네임(Username)으로 User 찾기
    Optional<User> findByUsername(String username);

    //중복 검사
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
