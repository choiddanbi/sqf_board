import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { instance } from '../../../apis/util/instance';
import { css } from '@emotion/react';
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
/** @jsxImportSource @emotion/react */

const layout = css`
    box-sizing: border-box;
    margin: 50px auto 300px;
    width: 1100px;
`;

const header = css`
    box-sizing: border-box;
    border: 1px solid #dbdbdb;
    padding: 10px 15px;

    & > h1 {
        margin: 0;
        margin-bottom: 15px;
        font-size: 38px;
        cursor: default;
    }
`;

const titleAndLike = css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    & button {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: none;
        background-color: #ffffff;
        cursor: pointer;
        
        & > svg {
            font-size: 30px;
        }
    }
    
`;

const boardInfoContainer = css`
    display: flex;
    justify-content: space-between;

    & span {
        margin-right: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: default;
    }

    & button {
        box-sizing: border-box;
        margin-left: 5px;
        border: 1px solid #dbdbdb;
        padding: 5px 20px;
        background-color: white;
        font-size: 12px;
        font-weight: 600;
        color: #333333;
        cursor: pointer;

        &:hover {
            background-color: #fafafa;
        }

        &:active {
            background-color: #eeeeee;
        }

    }
`;


const contentBox = css`
    box-sizing: border-box;
    border: 1px solid #dbdbdb;
    padding: 0px 15px;
    & img:not(img[width]) { // width 속성이 없는 (크기 조정을 안했으면) img 의 width 를 100%
        width: 100%;
    }
`;

const commentContainer = css`
    margin-bottom: 50px;
`;

const commentWriteBox = (level) => css`
    display: flex;
    box-sizing: border-box;
    margin-top: 5px;
    margin-left: ${level * 3}%;
    height: 80px;

    & > textarea {
        flex-grow: 1;
        margin-right: 5px;
        border: 1px solid #dbdbdb;
        outline: none;
        padding: 12px 15px;
        resize: none;
    }

    & > button {
        box-sizing: border-box;
        border: 1px solid #dbdbdb;
        width: 80px;
        background-color: #ffffff;
        cursor: pointer;
    }
`;

// 댓글 대댓글 레벨마다 점차 margin-left가 안으로 들어가야해서 level 매개변수를 받아오는 함수 작성
const commentListContainer = (level) => css`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-left: ${level * 3}%;
    border-bottom: 1px solid #dbdbdb;
    padding: 12px 15px;

    & > div:nth-of-type(1) {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
        border: 1px solid #dbdbdb;
        border-radius: 50%;
        width: 70px;
        height: 70px;
        overflow: hidden;

        & > img {
            height: 100%;
        }
    }
`;

const commentDetail = css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const detailHeader = css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;

    & > span:nth-of-type(1) {
        font-weight: 600;
        cursor: default;
    }
`;

const detailContent = css`
    margin-bottom: 10px;
    max-height: 50px;
    overflow-y: auto;
`;

const detailButtons = css`
    display: flex;
    justify-content: flex-end;
    width: 100%;

    & button {
        box-sizing: border-box;
        margin-left: 4px;
        border: 1px solid #dbdbdb;
        background-color: #ffffff;
        padding: 5px 10px;
        cursor: pointer;
    }
`;







function DetailPage(props) {

    // useParmas 는 url 에 있는 정보 들고 올 수 있음, App.js 에서의 /:bordId 부분 !
    // 이 url 의 boardId로 springboot 에 가서 board 정보 들고옴
    const params = useParams();
    const boardId = params.boardId;
    const queryClient = useQueryClient();
    const userInfoData = queryClient.getQueryData("userInfoQuery");
    const navigate = useNavigate();


    const [ commentData, setCommentData ] = useState({
        boardId: boardId, // 키랑 변수명 이 동일해서 그냥 boardId 로도 작성 가능
        parentId: null,
        content: ""
    });


    // 댓글 수정
    const [ commentModifyData, setCommentModifyData ] = useState({
        commentId: 0,
        content: ""
    });

    // react query 정의
    // 페이지 열리면 useQuery 는 자동으로 날림
    // 게시글 디테일
    const board = useQuery(
        ["boardQuery", boardId], // boardId 가 바뀌면 재랜더링 ~
        async () => {
            return instance.get(`/board/${boardId}`); // url의 boardId 를 가지고 요청 보냄
        }, {
            refetchOnWindowFocus: false,
            retry: 0
        }
    );

    // 좋아요 정보 들고오기
    const boardLike = useQuery(
        ["boardLikeQuery"],
        async () => {
            return instance.get(`/board/${boardId}/like`);
        },
        {
            refetchOnWindowFocus: false,
            retry: 0
        }
    );

    // 댓글 리스트, 갯수 조회
    // response 안에 data 안에 comments안에 {comment} 들을 배열안에 담아서 옴
    // comments의 응답 response 가 다른 말로는(?) comments.data 임!!
    const comments = useQuery(
        ["commentsQuery"],
        async () => {
            return await instance.get(`/board/${boardId}/comments`);
        },
        {
            retry: 0,
            onSuccess: response => console.log(response)
        }
    );


    // userquery 종류 중 하나인데 get요청 외에 사용!
    // 좋아요 누르면
    const likeMutation = useMutation(
        async () => {
            return await instance.post(`/board/${boardId}/like`)
        },
        {
            onSuccess: response => { // 좋아요가 눌리면 boardLike 다시 실행 -> db에서 좋아요 정보 다시 들고옴
                boardLike.refetch();
            }
        }
    );

    // 좋아요 취소 누르면
    const dislikeMutation = useMutation(
        async () => {
            return await instance.delete(`/board/like/${boardLike.data?.data.boardLikeId}`)
        },
        {
            onSuccess: response => { // 좋아요가 눌리면 boardLike 다시 실행 ?
                boardLike.refetch();
            }
        }
    );


    // 댓글 작성하기
    const commentMutation = useMutation(
        async () => {
            return await instance.post("/board/comment", commentData);
        },
        {
            onSuccess: response => {
                alert("작성이 완료되었습니다.");
                setCommentData({ // 초기화
                    boardId: boardId,
                    parentId: null,
                    content: ""
                });
                comments.refetch(); // 댓글 정보 다시 들고옴, refetch 랑 invalid 는 둘다 요청 다시 보내는건데 refetch는 부모에서 incalid는 자식에서(useclient)
            }
        }
    );

    // 댓글 수정
    const modifyCommentMutation = useMutation(
        async () => {
            return await instance.put(`/board/comment/${commentModifyData.commentId}`, commentModifyData);
        },
        {
            onSuccess: () => {
                alert("작성이 완료되었습니다.");
                setCommentModifyData({ // 초기화
                    commentId: 0,
                    content: ""
                });
                comments.refetch(); // 댓글 정보 다시 들고옴, refetch 랑 invalid 는 둘당 ㅛ청 다십 ㅗ내느건데 refetch는 부모에서 incalid는 자식에서(useclient)
            }
        }
    )

    const deleteCommentMutation = useMutation(
        async (commentId) => {
            return await instance.delete(`/board/comment/${commentId}`);
        },
        {
            onSuccess: response => {
                alert("댓글을 삭제하였습니다.");
                comments.refetch();
            }
        }
    );
    
    
    const handleLikeOnClike = () => {
        if(!userInfoData?.data) { // 로그인이 안되어 있으면
            if(window.confirm("로그인 후 이용 가능합니다. 로그인 페이지로 이동하시겠습니까 ?")) {
                navigate("/user/login");
            }
            return;
        }
        likeMutation.mutateAsync();
    };
    
    
    // 로그인이 안되어있으면 아예 좋아요 버튼이 없음
    const handleDislikeOnClike = () => {
        dislikeMutation.mutateAsync();
    };


    const handleCommentInputOnChage = (e) => {
        setCommentData(commentData => ({
            ...commentData,
            [e.target.name]: e.target.value
        }));
    }


    const handleCommentSubmitOnClick = () => {
        if(!userInfoData?.data) { // 로그인이 안되어 있으면
            if(window.confirm("로그인 후 이용 가능합니다. 로그인 페이지로 이동하시겠습니까 ?")) {
                navigate("/user/login");
            }
            return;
        }
        commentMutation.mutateAsync();
    }


    const handleCommentModifySubmitOnClick = () => {
        modifyCommentMutation.mutateAsync();
    }


    const handleReplyButtonOnClick = (commentId) => {
        setCommentData(commentData => ({ // 초기화
            boardId: boardId,
            parentId: commentId === commentData.parentId ? null : commentId, // 아래에 설명 참고 !
            content: ""
        }));

        // setCommentData(commentData => ({
        //     ...commentData,
        //     content: "",
        //     parentId: commentId === commentData.parentId ? null : commentId
        //     // 맨 처음에는 commentId는 내가 선택한 댓글id( commentData.parentId = null ) 둘이 다르니까 parentid : commentId 대입 ---> 이후부터 parentId 에 null 또는 commentId 댇입
        //     // commentId 는 여러 댓글들 중 댓글 하나( db에서 AI ), commentData.parentId는 내가 선택한 댓글
        //     // commentId === commentData.parentId 는 대댓글상태 -> parentId: null 로 줘서 대댓글 상태 해제
        //     // commentId !== commentData.parentId 이면 첫댓글 상태 -> parentId: commentId 로 줘서 대댓글 상태 부여
        // }));
    }

    const handleCommentModifyInputOnChage = (e) => {
        setCommentModifyData(commentData => ({
            ...commentData,
            [e.target.name]: e.target.value
        }));
    }

    // 수정 버튼
    const handleModifyCommentButtonOnClick = (commentId, content) => {
        setCommentModifyData(commentData => ({
            commentId,
            content: content // content 로 작성해도 가능
        }));
    }

    const handleModifyCommentCancleButtonOnClick = () => {
        setCommentModifyData(commentData => ({
            commentId : 0,
            content: ""
        }));
    }

    const handleDeleteCommentButtonOnClick = (commentId) => {
        deleteCommentMutation.mutateAsync(commentId);
    }

    




    return (
        <div css={layout}>
            <Link to={"/"}><h1>사이트 로고</h1></Link>
                {
                    board.isLoading && <></>
                }
                {
                    board.isError && <h1>{board.error.response.data}</h1>
                }
                {
                    board.isSuccess && 
                    <>
                        <div css={header}>
                            <div css={titleAndLike}>
                                <h1>{board.data.data.title}</h1>
                                <div>
                                    {
                                        !!boardLike?.data?.data?.boardLikeId 
                                        ?
                                        <button onClick={handleDislikeOnClike}>
                                            <IoMdHeart />
                                        </button>
                                        :
                                        <button onClick={handleLikeOnClike}>
                                            <IoMdHeartEmpty />
                                        </button>
                                    }
                                </div>
                            </div>

                            <div css={boardInfoContainer}>
                                <div>
                                    <span>
                                        작성자: {board.data.data.writerUsername}
                                    </span>
                                    <span>
                                        조회: {board.data.data.viewCount}
                                    </span>
                                    <span>
                                        추천: {boardLike?.data?.data.likeCount}
                                    </span>
                                </div>
                            <div>
                                {
                                    board.data.data.writerId === userInfoData?.data.userId && 
                                    <>
                                        <button>수정</button>
                                        <button>삭제</button>
                                    </>
                                }
                            </div>
                            </div>
                        </div>
                        
                        <div css={contentBox} dangerouslySetInnerHTML={{
                            __html: board.data.data.content
                        }}>
                        </div>

                        <div css={commentContainer}>
                                <h2>댓글 {comments?.data?.data.commentCount}</h2>
                                {
                                    // 첫댓글
                                    commentData.parentId === null &&
                                    <div css={commentWriteBox(0)}>
                                        <textarea name="content" onChange={handleCommentInputOnChage} value={commentData.content} placeholder='댓글을 입력하세요...'></textarea>
                                        <button onClick={handleCommentSubmitOnClick}>작성하기</button>
                                    </div>
                                }
                                <div>
                                {
                                    // response 안에 data 안에 comments안에 {comment} 들을 배열안에 담아서 옴
                                    // comments.data 가 response
                                    // comments.data.data 까지가 dto
                                    comments?.data?.data.comments.map(comment => 
                                        <div key={comment.id} >
                                            <div css={commentListContainer(comment.level)}>
                                                <div>
                                                    <img src="{comment.img}" alt="" />
                                                </div>
                                                <div css={commentDetail}>
                                                    <div css={detailHeader}>
                                                        <span>{comment.username}</span>
                                                        <span>{new Date(comment.createDate).toLocaleString()}</span>
                                                        {/* 스프링부트에서 온 LocalDate 를 (날짜 시간 사이에 T들어간 형태) T뺀 상태로 변환 */}
                                                    </div>
                                                        <pre css={detailContent}>{comment.content}</pre>
                                                    <div css={detailButtons}>
                                                        {
                                                        <div>
                                                            {
                                                                userInfoData?.data?.userId === comment.writerId && 
                                                                    commentModifyData.commentId === comment.id 
                                                                    ?
                                                                    <button onClick={handleModifyCommentCancleButtonOnClick}>취소</button>
                                                                    :
                                                                    <button onClick={() => handleModifyCommentButtonOnClick(comment.id, comment.content)}>수정</button>
                                                                // content 를 같이 보내주는 이유: 작성한 글 textarea에 보여주려고
                                                                }
                                                                <button onClick={() => handleDeleteCommentButtonOnClick(comment.id)}>삭제</button>
                                                        </div>
                                                        }
                                                        {
                                                            comment.level < 3 &&
                                                            <div>
                                                                <button onClick={() => handleReplyButtonOnClick(comment.id)}>답글</button>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                                {
                                                    // 대댓글
                                                    commentData.parentId === comment.id && 
                                                    <div css={commentWriteBox(comment.level)}>
                                                        <textarea name="content" onChange={handleCommentInputOnChage} value={commentData.content} placeholder='답글을 입력하세요...'></textarea>
                                                        <button onClick={handleCommentSubmitOnClick}>작성하기</button>
                                                    </div>
                                                }
                                                {
                                                    // 댓글 수정
                                                    commentModifyData.commentId === comment.id && 
                                                    <div css={commentWriteBox(comment.level)}>
                                                        <textarea name="content" onChange={handleCommentModifyInputOnChage} value={commentModifyData.content} placeholder='답글을 입력하세요...'></textarea>
                                                        <button onClick={handleCommentModifySubmitOnClick}>수정하기</button>
                                                    </div>
                                                }
                                        </div>
                                    )
                                }
                            </div>
                    </div>    
                    </>
                }
        </div>
    );
}

export default DetailPage;