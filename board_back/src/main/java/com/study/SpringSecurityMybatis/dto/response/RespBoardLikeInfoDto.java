package com.study.SpringSecurityMybatis.dto.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RespBoardLikeInfoDto {
    private Long boardLikeId;
    private int likeCount;
}
