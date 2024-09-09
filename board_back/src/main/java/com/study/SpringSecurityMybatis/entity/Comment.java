package com.study.SpringSecurityMybatis.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Comment {
    private Long id;
    private Long boardId;
    private Long parentId;
    private String content;
    private Long writerId;
    private LocalDateTime createDate;
    private int level;


    private String username;
    private String img;
}
