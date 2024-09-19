import { css } from '@emotion/react';
/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import ReactPaginate from 'react-paginate';
import { useQuery } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { instance } from '../../../apis/util/instance';

const paginateContainer = css`
    & > ul {
        list-style-type: none;
        display: flex;

        & > li {
            margin: 0px 5px;
        }

        & a {
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #dbdbdb;
            border-radius: 32px;
            padding: 0px 5px;
            min-width: 32px;
            height: 32px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
        }

        & .active {
            border-radius: 32px;
            background-color: #bbbbbb;
            color: #ffffff;
        }
    }
`;



function SearchBoardPage(props) {
    // ? 를 기준으로 오른쪽이 usesearchParams 왼쪽이 useParams
    const [ searchParams, setSearchParams ] = useSearchParams(); // 쿼리스트링 or params 란? 주소:포트/페이지URL?key=value 
    const [ totalPageCount, setTotalPageCount ] = useState(1);
    const [ searchValue, setSearchValue ] = useState(searchParams.get("search") ?? "");
    const [ searchOption, setSearchOption ] = useState(searchParams.get("option") ?? "all");
    const navigate = useNavigate();
    const limit = 10;


    // 페이지의 값은 변하지만 주소는 그대로이다 = 랜더링 되어지는 화면(컴포넌트)은 그대로!!
    // page라는 값이 변함 -> dependency에 의해서 boardList useQuery 재동작
    const handlePageOnChange = (e) => {
        navigate(`/board/search?page=${e.selected + 1}&option=${searchOption}&search=${searchValue}`);
    }

    const handleSearchOptionOnChange = (e) => {
        setSearchOption(e.target.value);
    }

    // 검색
    const handleSearchInputOnChange = (e) => {
        setSearchValue(e.target.value);
    }

    const handleSearchButtonOnClick = () => {
        navigate(`/board/search?page=1&option=${searchOption}&search=${searchValue}`);
    }


    const boardList = useQuery(
        ["boardListQuery", searchParams.get("page"), searchParams.get("option"), searchParams.get("search")],
        async () => await instance.get(`/board/search?page=${searchParams.get("page")}&limit=${limit}&search=${searchValue}&option=${searchOption}`),
        {
            retry: 0,
            refetchOnWindowFocus: false,
            onSuccess: response => setTotalPageCount(
                response.data.totalCount % limit === 0 
                ? response.data.totalCount / limit 
                : Math.floor(response.data.totalCount / limit) + 1)
        }
    );



    return (
        <div>
            <Link to={"/"}><h1>사이트 로고</h1></Link>
            <div>
                <select onChange={handleSearchOptionOnChange} value={searchOption}>
                    <option value="all">전체</option>
                    <option value="title">제목</option>
                    <option value="writer">작성자</option>
                </select>
                <input type="search" onChange={handleSearchInputOnChange} value={searchValue} />
                <button onClick={handleSearchButtonOnClick}>검색</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>추천</th>
                        <th>조회</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        boardList.isLoading
                        ?
                        <></>
                        :
                        boardList.data?.data?.boards.map(board => 
                            <tr key={board.id} onClick={() => navigate(`/board/detail/${board.id}`)}>
                                <td>{board.id}</td>
                                <td>{board.title}</td>
                                <td>{board.writerName}</td>
                                <td>{board.likeCount}</td>
                                <td>{board.viewCount}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <div css={paginateContainer}>
                <ReactPaginate 
                    breakLabel= "..."
                    previousLabel={<> <IoMdArrowDropleft /> </>}
                    nextLabel={<> <IoMdArrowDropright /> </> }
                    pageCount={totalPageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    activeClassName='active'
                    onPageChange={handlePageOnChange}
                    forcePage={parseInt(searchParams.get("page")) - 1 }
                />
            </div>
        </div>
    );
}

export default SearchBoardPage;