package com.study.SpringSecurityMybatis.dto.request;

import lombok.Data;

@Data
public class ReqSearchBoardDto {
    private Long page;
    private Long limit;
    private String search;
    private String option;
}
