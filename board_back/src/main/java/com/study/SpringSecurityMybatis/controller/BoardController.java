package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.aspect.annotation.ValidAop;
import com.study.SpringSecurityMybatis.dto.request.ReqBoardListDto;
import com.study.SpringSecurityMybatis.dto.request.ReqModifyContentDto;
import com.study.SpringSecurityMybatis.dto.request.ReqSearchBoardDto;
import com.study.SpringSecurityMybatis.dto.request.ReqWriteBoardDto;
import com.study.SpringSecurityMybatis.service.BoardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Slf4j
@RestController
public class BoardController {

    @Autowired
    private BoardService boardService;

    // title 랑 content 로 요청이 들어옴
    @ValidAop
    @PostMapping("/board")
    public ResponseEntity<?> write(@Valid @RequestBody ReqWriteBoardDto dto, BindingResult bindingResult) {
        return ResponseEntity.ok().body(boardService.writeBoard(dto));
        // 이렇게하면 RespDto 안만들어도 되고 Service 의 자료형은 Long , return 도 board.getId()
        // return ResponseEntity.ok().body("boardId", boardService.writeBoard(dto));
    }

    // 검색
    @GetMapping("/board/search")
    public ResponseEntity<?> getSearchBoards(ReqSearchBoardDto dto) {
        System.out.println(dto);
        return ResponseEntity.ok().body(boardService.getSearchBoard(dto));
    }

    // id 별 게시글 디테일 board 조회
    @GetMapping("/board/{boardId}")
    public ResponseEntity<?> getDetail(@PathVariable Long boardId) {
        return ResponseEntity.ok().body(boardService.getBoardDetail(boardId));
    }

    // id 별 좋아요 상태 조회 ( 로그인 불필요 )
    @GetMapping("/board/{boardId}/like")
    public ResponseEntity<?> getLikeInfo(@PathVariable Long boardId) {
        return ResponseEntity.ok().body(boardService.getBoardLike(boardId));
    }

    // 게시글 전체 조회
    @GetMapping("/board/list")
    public ResponseEntity<?> getBoards(ReqBoardListDto dto) {
        return ResponseEntity.ok().body(boardService.getBoardList(dto));
    }

    // 좋아요 누름 ( 로그인 필요 )
    @PostMapping("/board/{boardId}/like")
    public ResponseEntity<?> like(@PathVariable Long boardId) {
        boardService.like(boardId);
        return ResponseEntity.ok().body(true);
    }

    // 좋아요 취소 ( 로그인 필요 )
    @DeleteMapping("/board/like/{boardLikeId}")
    public ResponseEntity<?> disLike(@PathVariable Long boardLikeId) {
        boardService.dislike(boardLikeId);
        return ResponseEntity.ok().body(true);
    }

    // 게시글 삭제
    @DeleteMapping("/board/content/{boardId}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long boardId) {
        log.info("게시글 삭제 요청 : {}", boardId);
        boardService.deleteBoards(boardId);
        return ResponseEntity.ok().body(true);
    }

    // 게시글 수정
    @PutMapping("/board/content/{boardId}")
    public ResponseEntity<?> modifyContent(@RequestBody ReqModifyContentDto dto) {
        log.info("게시글 수정 요청 : {}", dto);
        boardService.modifyContent(dto);
        return ResponseEntity.ok().body(true);
    }
}
