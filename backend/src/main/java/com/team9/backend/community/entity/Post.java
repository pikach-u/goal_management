package com.team9.backend.community.entity;

import com.team9.backend.user.entity.User; // User 임포트
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_no")
    private Long post;

    @Column(name = "post_title")
    private String postTitle;

    @Column(name = "post_content", columnDefinition = "TEXT")
    private String postContent;

    @Column(name = "post_count")
    private Integer postCount = 0;

    @Column(name = "post_create_date")
    private LocalDateTime postCreateDate = LocalDateTime.now();

    @Column(name = "post_delete_date")
    private LocalDateTime postDeleteDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @Column(name = "post_like_count")
    @ColumnDefault("0")
    private int postLikeCount = 0;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostLike> postLikes = new ArrayList<>();

    public void incrementLikeCount() {
        this.postLikeCount++;
    }

    public void decrementLikeCount() {
        if (this.postLikeCount > 0) {
            this.postLikeCount--;
        }
    }

    // 조회수
    public void incrementPostCount() {
        this.postCount++;
    }

    public Post(String postTitle, String postContent, User user) {
        this.postTitle = postTitle;
        this.postContent = postContent;
        this.user = user;
        this.postCreateDate = LocalDateTime.now();
        this.postCount = 0;
        this.postLikeCount = 0;
    }
}

