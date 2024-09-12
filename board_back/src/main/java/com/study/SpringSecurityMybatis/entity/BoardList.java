package com.study.SpringSecurityMybatis.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class BoardList {
    private Long id;
    private String title;
    private String writerName;
    private Integer likeCount;
    private Integer viewCount;
}
