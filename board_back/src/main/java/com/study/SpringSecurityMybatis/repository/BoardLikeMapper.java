package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.BoardLike;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BoardLikeMapper {
    int save(BoardLike boardLike); // 좋아요 누름
    int deleteById(Long id); // 좋아요 취소
    BoardLike findByBoardIdAndUserId(@Param("boardId") Long boardId, @Param("userId") Long UserId); // 사용자마다 조아요를 누른적이 있나 없나 체크
    int getLikeCountByBoardId(Long boardId); // 게시글 별 좋아요 갯수
}
