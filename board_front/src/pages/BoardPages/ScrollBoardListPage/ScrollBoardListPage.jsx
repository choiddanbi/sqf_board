import { css } from '@emotion/react';
import React, { useEffect, useRef, useState } from 'react';
import { IoMdHeart } from 'react-icons/io';
import { useInfiniteQuery } from 'react-query';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { instance } from '../../../apis/util/instance';
/** @jsxImportSource @emotion/react */


const layout = css`
    margin: 0px auto;
    width: 1030px;
`;

const cardLayout = css`
    display: flex;
    flex-wrap: wrap;
    border-top: 3px solid #dbdbdb;
    padding: 0px;
    padding-top: 50px;
    width: 100%;
    list-style-type: none;
`;

const card = css`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    margin: 0px 0px 40px;
    width: 330px;
    height: 330px;
    box-shadow: 0px 3px 5px #00000011;
    transition: all 0.3s ease-in-out;
    cursor: pointer;

    &:nth-of-type(3n - 1) {
        margin: 0px 20px 40px;
    }

    &:hover {
        transform: translateY(-5%);
        box-shadow: 0px 3px 10px #00000011;
    }
`;

const cardMain = css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const cardImg = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 170px;
    overflow: hidden;

    & > img {
        width: 100%;
        background-color: #ffffff;
    }
`;

const cardContent = (isShowImg) => css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 16px;

    & > h3 {
        margin: 0px 0px 4px;
        width: 100%;
        overflow: hidden; // 글자가 넘치면 ... 으로 표현
        text-overflow: ellipsis; // 글자가 넘치면 ... 으로 표현
        white-space: nowrap; // 줄바꿈 안한다
    }

    & > div {
        display: -webkit-box;
        overflow: hidden;
        word-break: break-all;
        -webkit-line-clamp: ${isShowImg ? 3 : 6};
        -webkit-box-orient: vertical;   
        text-overflow: ellipsis;
        & > * {
            margin: 0px;
            font-size: 16px;
            font-weight: 400;
        }
    }
`;

const cardFooter = css`
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f5f5f5;
    padding: 0px 15px;
    height: 50px;

    & > div:nth-of-type(1) {
        display: flex;
        align-items: center;
        font-weight: 600;

        & > img {
            margin-right: 5px;
            border: 1px solid #dbdbdb;
            border-radius: 50%;
            width: 20px;
            height: 20px;
        }

        & > span {
            font-weight: 400;
            margin-right: 8px;
            font-size: 14px;
            color: #999999;
        }
    }

    & > div:nth-of-type(2) {
        display: flex;
        align-items: center;
    }
`;


function ScrollBoardListPage(props) {
    const loadMoreRef = useRef(null);
    const limit = 20;
    const navigate = useNavigate();

    // 무한 스크롤용 useQuery! : 항상 이거씀
    const boardList = useInfiniteQuery(
        ["boardScrollQuery"],
        async ({ pageParam = 1 }) => await instance.get(`/board/list?page=${pageParam}&limit=${limit}`),
        {
            getNextPageParam: (lastPage, allPage) => {
                const totalPageCount = lastPage.data.totalCount % limit === 0
                    ? lastPage.data.totalCount / limit // lastPage 는 마지막으로 응답받은 객체 dto( 즉, 현재 페이지 ), allPage 는 dto를 가지고 있는 배열
                    : Math.floor(lastPage.data.totalCount / limit) + 1;

                return totalPageCount !== allPage.length ? allPage.length + 1 : null; // 현재 페이지가 마지막 페이지에 닿았으면 null , 마지막 페이지가 아니라면 현재페이지 + 1, --> pageParam 으로 들어감 ( 자동으로 )
            }
        }
    );

    // 무한 스크롤 ( 스크롤을 내리다가 맨 아래에 있는 loadMoreRef 에 observer가 닿으면 동작 )
    useEffect(() => {
        if(!boardList.hasNextPage || !loadMoreRef.current ) {
            return;
        }

        const observer = new IntersectionObserver((entries) => { 
            if(entries[0].isIntersecting) {
                boardList.fetchNextPage(); // 다음 페이지 들고와라
            }
        }, { threshold: 1.0 });

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();

    }, [boardList.hasNextPage]);

    return (
        <div css={layout}>
            <Link to={"/"}><h1>사이트 로고</h1></Link>
            <ul css={cardLayout}>
                {
                    boardList.data?.pages.map(page => page.data.boards.map(board => {
                        // console.log(boardList);
                        // 본문 안에 p태그 안에 <img> 태그가 있는 경우
                        const mainImgStartIndex = board.content.indexOf("<img"); // <img 로 시작하는 태그를 찾아서
                        let mainImg = board.content.slice(mainImgStartIndex); // <img> 부터 끝까지 자름
                        mainImg = mainImg.slice(0, mainImg.indexOf(">") + 1); // 모두 제거 후 img 태그 닫히는 구간 뒤에 것들 제거 -> <img> ~ </img> 까지 img 태그만 들고옴 !!
                        const mainImgSrc = mainImg.slice(mainImg.indexOf("src") + 5, mainImg.length - 2); // 이미지 태그 안에서 src 만 가져와서 firebase에 있는 사진 들고옴
                        //console.log(mainImg);

                        // 본문 내용 찾기 ( p태그 )
                        let mainContent = board.content;

                        // 본문에 이미지가 있을 경우 이미지를 제외한 본문을 보여줌
                        // <p><img />asas</p>
                        // <p>assad<img /></p>
                        // <p>assad</p>
                        while(true) {
                            const pIndex = mainContent.indexOf("<p>");
                            if(pIndex === -1) { // 본문에 p태그가 없으면
                                mainContent = "";
                                break;
                            }
                            mainContent = mainContent.slice(pIndex + 3); // 앞의 내용부터 <p> 까지 자르기
                            if(mainContent.indexOf("<img") !== 0 ) { // 본문에 이미지로 시작하지 않고
                                if(mainContent.includes("<img")) { // img 태그를 포함한다면 ex) <p>assad<img /></p>
                                    mainContent = mainContent.slice(0, mainContent.indexOf("<img")); // img는 자르고 본문에 내용만 출력 assad
                                    break;
                                }
                                mainContent = mainContent.slice(0, mainContent.indexOf("</p>")); // 본문에 내용만 출력 ex) <p>assad</p> -> assad
                                break;
                            }
                        }
                            
                        return (
                            <li key={board.id} css={card} onClick={() => navigate(`/board/detail/${board.id}`)}>
                                <main css={cardMain}>
                                    {
                                        // 이미지가 있다면 이미지를 보여줘라
                                        mainImgStartIndex != -1 && 
                                        <div css={cardImg}>
                                            <img src={mainImgSrc} alt="" />
                                        </div>
                                    }
                                    <div css={cardContent(mainImgStartIndex != -1)}>
                                        <h3>{board.title}</h3>
                                        <div dangerouslySetInnerHTML={{ __html:mainContent }}></div>
                                    </div>
                                </main>
                                <footer css={cardFooter}>
                                    <div>
                                        <img src={board.writerProfileImg} alt="" />
                                        <span>by</span>
                                        {board.writerName}
                                    </div>
                                    <div><IoMdHeart/><span>{board.likeCount}</span></div>
                                </footer>
                            </li>
                        )
                    }))
                }
                
            </ul>
            <div ref={loadMoreRef}></div>
        </div>
    );
}

export default ScrollBoardListPage;