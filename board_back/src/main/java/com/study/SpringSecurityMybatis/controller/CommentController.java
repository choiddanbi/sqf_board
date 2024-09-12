package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.dto.request.ReqModifyCommentDto;
import com.study.SpringSecurityMybatis.dto.request.ReqWriteCommentDto;
import com.study.SpringSecurityMybatis.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CommentController {

    @Autowired
    private CommentService commentService;

    // 댓글 작성
    @PostMapping("/board/comment")
    public ResponseEntity<?> writeComment(@RequestBody ReqWriteCommentDto dto) {
        commentService.write(dto);
        return ResponseEntity.ok().body(true);
    }

    // 댓글 정보 및 갯수 조회
    @GetMapping("/board/{boardId}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long boardId) {
        return ResponseEntity.ok().body(commentService.getComments(boardId));
    }

    // 댓글 삭제
    @DeleteMapping("/board/comment/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComments(commentId);
        return ResponseEntity.ok().body(true);
    }

    // 댓글 수정
    @PutMapping("/board/comment/{commentId}")
    public ResponseEntity<?> modifyComment(@RequestBody ReqModifyCommentDto dto) {

        commentService.modifyComments(dto);
        return ResponseEntity.ok().body(true);
    }
}
