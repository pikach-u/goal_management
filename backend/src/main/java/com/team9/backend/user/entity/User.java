package com.team9.backend.user.entity;

import com.team9.backend.auth.entity.AuthProvider;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users") // 예약어 충돌 방지
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String userId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String bio;

    @Enumerated(EnumType.STRING)
    private AuthProvider provider;      // LOCAL, GOOGLE, GITHUB

    private String providerId;

    private boolean enabled;

    @PrePersist
    protected void onCreate() { enabled = true; }   // 회원가입 시 자동으로 true

    private String role;          // USER, ADMIN
    private String motivationType;  // default: ??
    private boolean goalVisibility;  // 친구공개 추가: bool -> enum
    private boolean progressVisibility;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;    // 생성 시각

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;    // 수정 시각

    @Column(name = "profile_image_url", columnDefinition = "TEXT")
    private String profileImageUrl;


//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//    private List<Goal> goals = new ArrayList<>();
//
//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//    private List<Post> posts = new ArrayList<>();

    // 기본 사용자 권한 부여
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.role));  //ROLE_USER or ROLE_ADMIN
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    // Lombok(@Data)이 자동 생성하지 않는 UserDetails의 기본 메서드도
    // 명시적으로 구현
    @Override
    public boolean isAccountNonExpired(){
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}
