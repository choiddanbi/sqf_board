package com.study.SpringSecurityMybatis.dto.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RespBoardDetailDto {
    // db 컬럼에 있는데
    private Long boardId;
    private String title;
    private String content;
    private int viewCount;

    // writerId 랑 writerUsername 는 없어서
    // user 랑 조인 필요
    private Long writerId;
    private String writerUsername;

}
