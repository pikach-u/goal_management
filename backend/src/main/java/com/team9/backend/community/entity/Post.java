package com.team9.backend.community.entity;

import com.team9.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

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
    private Long postNo;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    //조회수
    public void incrementPostCount() {
        this.postCount++;
    }
}
