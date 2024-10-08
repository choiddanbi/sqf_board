package com.study.SpringSecurityMybatis.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Board {
    // db 컬럼
    private Long id;
    private String title;
    private String content;
    private Long userId;
    private int viewCount;

    // 조인용
    private User user;
}
