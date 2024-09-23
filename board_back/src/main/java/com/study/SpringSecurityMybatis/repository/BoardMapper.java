package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.Board;
import com.study.SpringSecurityMybatis.entity.BoardList;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface BoardMapper {
    int save(Board board);
    Board findById(Long id);
    List<BoardList> findAllByStartIndexAndLimit(
            @Param("startIndex") Long startIndex,
            @Param("limit") Long limit);
    List<BoardList> findAllBySearch(Map<String, Object> params);
    int modifyViewCountById(Long id);
    int getCountAll();
    int getCountAllBySearch(Map<String, Object> params);
    int deleteById(Long id);
    int modifyContent(Board board);
}
