package com.study.SpringSecurityMybatis.dto.request;

import com.study.SpringSecurityMybatis.entity.Board;
import lombok.Data;

@Data
public class ReqModifyContentDto {
    private Long boardId;
    private String content;

    public Board toEntity() {
        return Board.builder()
                .id(boardId)
                .content(content)
                .build();
    }
}
