import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { instance } from '../../../apis/util/instance';
import { css } from '@emotion/react';
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
/** @jsxImportSource @emotion/react */

const layout = css`
    box-sizing: border-box;
    margin: 50px auto 0px;
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


function DetailPage(props) {

    // useParmas 는 url 에 있는 정보 들고 올 수 있음, App.js 에서의 /:bordId 부분 !
    // 이 url 의 boardId로 springboot 에 가서 board 정보 들고옴
    const params = useParams();
    const boardId = params.boardId;
    const queryClient = useQueryClient();
    const userInfoData = queryClient.getQueryData("userInfoQuery");
    const navigate = useNavigate();
    // console.log(boardId);


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

    // 좋아요 
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

    // userquery 종류 중 하나인데 get요청 외에 사용!
    const likeMutation = useMutation(
        async () => {
            return await instance.post(`/board/${boardId}/like`)
        },
        {
            onSuccess: response => { // 좋아요가 눌리면 boardLike 다시 실행 ?
                boardLike.refetch();
            }
        }
    );

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


    const handleDislikeOnClike = () => {
        dislikeMutation.mutateAsync();
    };

        
    const handleLikeOnClike = () => {
        if(!userInfoData?.data) { // 로그인이 안되어 있으면
            if(window.confirm("로그인 후 이용 가능합니다. 로그인 페이지로 이동하시겠습니까 ?")) {
                navigate("/user/login");
            }
            return;
        }
        likeMutation.mutateAsync();
    };


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
                    </>
                }
        </div>
    );
}

export default DetailPage;