package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.ReqBoardListDto;
import com.study.SpringSecurityMybatis.dto.request.ReqModifyContentDto;
import com.study.SpringSecurityMybatis.dto.request.ReqSearchBoardDto;
import com.study.SpringSecurityMybatis.dto.request.ReqWriteBoardDto;
import com.study.SpringSecurityMybatis.dto.response.RespBoardDetailDto;
import com.study.SpringSecurityMybatis.dto.response.RespBoardLikeInfoDto;
import com.study.SpringSecurityMybatis.dto.response.RespBoardListDto;
import com.study.SpringSecurityMybatis.dto.response.RespWriteBoardDto;
import com.study.SpringSecurityMybatis.entity.Board;
import com.study.SpringSecurityMybatis.entity.BoardLike;
import com.study.SpringSecurityMybatis.entity.BoardList;
import com.study.SpringSecurityMybatis.entity.Comment;
import com.study.SpringSecurityMybatis.exception.AccessDeniedException;
import com.study.SpringSecurityMybatis.exception.NotFoundBoardException;
import com.study.SpringSecurityMybatis.repository.BoardLikeMapper;
import com.study.SpringSecurityMybatis.repository.BoardMapper;
import com.study.SpringSecurityMybatis.repository.CommentMapper;
import com.study.SpringSecurityMybatis.security.principal.PrincipalUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class BoardService {

    @Autowired
    private BoardMapper boardMapper;

    @Autowired
    private BoardLikeMapper boardLikeMapper;

    @Autowired
    private CommentMapper commentMapper;

    public RespWriteBoardDto writeBoard(ReqWriteBoardDto dto) {
        PrincipalUser principalUser = (PrincipalUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 요청 들어온 title 랑 content 랑 꺼내온 id 를 board tb 에 save
        Board board = dto.toEntity(principalUser.getId());
        boardMapper.save(board);

        return RespWriteBoardDto.builder()
                .id(board.getId())
                .build();
    }

    // 검색
    public RespBoardListDto getSearchBoard(ReqSearchBoardDto dto) {
        Long startIndex = ( dto.getPage() - 1 ) * dto.getLimit();
        Map<String, Object> params = Map.of(
                "startIndex", startIndex,
                "limit", dto.getLimit(),
                "searchValue", dto.getSearch() == null ? "" : dto.getSearch(),
                "option", dto.getOption() == null || dto.getOption().isBlank() ? "all" : dto.getOption()
        );
        List<BoardList> boardLists = boardMapper.findAllBySearch(params);
        Integer boardTotalCount = boardMapper.getCountAllBySearch(params);

        return RespBoardListDto.builder()
                .boards(boardLists)
                .totalCount(boardTotalCount)
                .build();
    }


    // 게시글 전체 조회
    // 전체 게시글 갯수 + startIndex, limit 필요 !
    public RespBoardListDto getBoardList(ReqBoardListDto dto) {
        Long startIndex = ( dto.getPage() - 1 ) * dto.getLimit(); // 한 페이지당 limit개씩 ( 0번은 1~limit, 1번은 11~limit .... )
        List<BoardList> boardLists =  boardMapper.findAllByStartIndexAndLimit(startIndex, dto.getLimit());
        Integer boardTotalCount = boardMapper.getCountAll();

        return RespBoardListDto.builder()
                .boards(boardLists)
                .totalCount(boardTotalCount)
                .build();
    }



    public RespBoardDetailDto getBoardDetail(Long boardId) {
        Board board = boardMapper.findById(boardId);

        if(board == null) {
            throw new NotFoundBoardException("해당 게시글을 찾을 수 없습니다.");
        }

        // db에 viewcount + 1
        boardMapper.modifyViewCountById(boardId);

        // react 로 return 용 respdto 에 viewcount + 1 인데 바로 return 에 + 1 넣어줘도 됨 ~
        // board.setViewCount(board.getViewCount() + 1);

        return RespBoardDetailDto.builder()
                .boardId(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .writerId(board.getUserId())
                .writerUsername(board.getUser().getUsername())
                .viewCount(board.getViewCount() + 1)
                .build();
    }



    public RespBoardLikeInfoDto getBoardLike(Long boardId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(authentication.getName());
        Long userId = null;

        // 로그인 상태로 좋아요 조회하면
        if (!authentication.getName().equals("anonymousUser")) {
            PrincipalUser principalUser = (PrincipalUser) authentication.getPrincipal();
            userId = principalUser.getId();
        }

        BoardLike boardLike = boardLikeMapper.findByBoardIdAndUserId(boardId, userId);
        int likeCount = boardLikeMapper.getLikeCountByBoardId(boardId);

        return RespBoardLikeInfoDto.builder()
                .boardLikeId(boardLike == null ? 0 : boardLike.getId())
                .likeCount(likeCount)
                .build();
    }


    // 좋아요 ~
    public void like(Long boardId) {
        PrincipalUser principalUser = (PrincipalUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        BoardLike boardLike = BoardLike.builder()
                .boardId(boardId)
                .userId(principalUser.getId())
                .build();

        boardLikeMapper.save(boardLike);
    }


    // 좋아요 취소 ~
    public void dislike(Long boardLikeId) {
        boardLikeMapper.deleteById(boardLikeId);
    }

    // 게시글 삭제
    public void deleteBoards(Long boardId) {
        boardMapper.deleteById(boardId);
        commentMapper.deleteByBoardId(boardId);
        boardLikeMapper.deleteByBoardId(boardId);
    }

    // 게시글 수정
    public void modifyContent(ReqModifyContentDto dto) {
        boardMapper.modifyContent(dto.toEntity());
    }
}
