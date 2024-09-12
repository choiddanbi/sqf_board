package com.study.SpringSecurityMybatis.dto.response;

import com.study.SpringSecurityMybatis.entity.BoardList;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespBoardListDto {

    private List<BoardList> boards;
    private Integer totalCount;

}
