package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.Comment;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommentMapper {
    int save(Comment comment);
    List<Comment> findAllByBoardId(Long boardId); // db에서 orderby로 정렬한 순서를 유지시켜주기 위해서 List 사용
    int getCommentCountByBoardId(Long boardId);
    int deleteById(Long id);
    Comment findById(Long id);
    Comment findByParentId(Long parentId);
    int modifyComment(Comment comment);
    int deleteByBoardId(Long boardId);
}
