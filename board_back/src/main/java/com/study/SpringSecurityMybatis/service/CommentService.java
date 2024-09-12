package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.ReqModifyCommentDto;
import com.study.SpringSecurityMybatis.dto.request.ReqWriteCommentDto;
import com.study.SpringSecurityMybatis.dto.response.RespCommentDto;
import com.study.SpringSecurityMybatis.entity.Comment;
import com.study.SpringSecurityMybatis.exception.AccessDeniedException;
import com.study.SpringSecurityMybatis.repository.CommentMapper;
import com.study.SpringSecurityMybatis.security.principal.PrincipalUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    @Autowired
    private CommentMapper commentMapper;

    public void write(ReqWriteCommentDto dto) {
        PrincipalUser principalUser = (PrincipalUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        commentMapper.save(dto.toEntity(principalUser.getId()));
    }


    // 댓글 전체 내용 및 갯수 조회
    public RespCommentDto getComments(Long boardId) {

        return RespCommentDto.builder()
                .comments(commentMapper.findAllByBoardId(boardId))
                .commentCount(commentMapper.getCommentCountByBoardId(boardId))
                .build();
    }

    public void deleteComments(Long commentId) {
        accessCheck(commentId);
        commentMapper.deleteById(commentId);
    }

    // 댓글 수정
    public void modifyComments(ReqModifyCommentDto dto) {
        accessCheck(dto.getCommentId());
        commentMapper.modifyComment(dto.toEntity());
    }


    private void accessCheck(Long commentId) {
        PrincipalUser principalUser = (PrincipalUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Comment comment = commentMapper.findById(commentId);
        if(principalUser.getId() != comment.getWriterId()) {
            throw new AccessDeniedException();
        }
    }
}
