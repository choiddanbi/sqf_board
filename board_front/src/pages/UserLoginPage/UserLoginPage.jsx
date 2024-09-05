import { css } from '@emotion/react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signinApi } from '../../apis/signinApi';
import { instance } from '../../apis/util/instance';
/** @jsxImportSource @emotion/react */

const layout = css`
    display: flex;
    flex-direction: column;
    margin: 0px auto;
    width: 460px;
`;

const logo = css`
    font-size: 24px;
    margin-bottom: 40px;
`

const loginInfoBox = css`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    width: 100%;

    & input {
        box-sizing: border-box;
        border: none;
        outline: none;
        width: 100%;
        height: 50px;
        font-size: 16px;
    }

    & p {
        margin: 0px 0px 10px 10px;
        color: #ff2f2f;
        font-size: 12px;
    }

    & div {
        box-sizing: border-box;
        width: 100%;
        border: 1px solid #dbdbdb;
        border-bottom: none;
        padding: 0px 20px;
    }

    & div:nth-of-type(1) {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    & div:nth-last-of-type(1) {
        border-bottom: 1px solid #dbdbdb;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`;

const loginButton = css`
    border: none;
    border-radius: 10px;
    width: 100%;
    height: 50px;
    background-color: #999999;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
`;

function UserLoginPage(props) {
    const navigate = useNavigate();

    const [ inputUser, setInputUser ] = useState({
        username: "",
        password: "",
    });

    const [ fieldErrorMessages, setFieldErrorMessages ] = useState({
        username: <></>,
        password: <></>,
    }); 

    const handleInputUserOnChange = (e) => {
        setInputUser(inputUser => ({
            ...inputUser,
            [e.target.name]: e.target.value
        }));
    }

    const showFieldErrorMessage = (fieldErrors) => {
        let EmptyFieldErrors = {
            username: <></>,
            password: <></>,
        };

        for(let fieldError of fieldErrors) {
            EmptyFieldErrors = {
                ...EmptyFieldErrors,
                [fieldError.field]: <p>{fieldError.defaultMessage}</p>,
            }
        }

        setFieldErrorMessages(EmptyFieldErrors);
    }

    const handleLoginSubmitOnClick = async () => {
        const signinData = await signinApi(inputUser);
        if(!signinData.isSuceess) { // 로그인이 false 일 때
            if(signinData.errorStatus === 'fieldError') {
                showFieldErrorMessage(signinData.error);
            }
            if(signinData.errorStatus === 'loginError') {
                let EmptyFieldErrors = {
                    username: <></>,
                    password: <></>,
                };
                setFieldErrorMessages(EmptyFieldErrors);
                alert(signinData.error);
            }
            return;
        }

        localStorage.setItem("accessToken", "Bearer " + signinData.token.accessToken); // 이건 localstorge에 넣어도 instance 에ㅔ 들어있는 header 는 바뀌지 않음
        
        instance.interceptors.request.use(config => {
            config.headers["Authorization"] = localStorage.getItem("accessToken"); // 기존 config 설정을 최근 토큰으로 수정 ! -> instance 는 처음 한번만 실행되는거라 이걸 꼭 수동으로 해줘야함
            return config;
        });


        // window.hisroy = 이전에 페이지이동했떤 page들 기록
        if(window.history.length > 2) { // redirect가 됐다는 뜻, 탭 열고 바로 프로필로 왔을 경우 ( ex. 로그인 창으로 갔다가 로그인 하면 프로필로 가짐 !! )
            navigate(-1); // 재랜더링 안시켜줄려고 navigate 사용
            return;
        }
        navigate("/");// navigate 를 안쓰고 widow를 쓴 이유는 instance 의 token을 바꿔주러ㅕ고, 창 열자마자 로그인으로 들어갔을 경우, 
        // console.log(response);
    }

    return (
        <div css={layout}>
            <Link to={"/"}><h1 css={logo}>사이트 로고</h1></Link>
            <div css={loginInfoBox}>
                <div>
                    <input type="text" name='username' onChange={handleInputUserOnChange} value={inputUser.username} placeholder='아이디'/>
                    {fieldErrorMessages.username}
                </div>
                <div>
                    <input type="password" name='password' onChange={handleInputUserOnChange} value={inputUser.password} placeholder='비밀번호'/>
                    {fieldErrorMessages.password}
                </div>
            </div>
            <button css={loginButton} onClick={handleLoginSubmitOnClick}>로그인</button>
            <a href="http://localhost:8080/oauth2/authorization/google">구글로그인</a>
            <a href="http://localhost:8080/oauth2/authorization/naver">네이버로그인</a>
            <a href="http://localhost:8080/oauth2/authorization/kakao">카카오로그인</a>
        </div>
    );
}

export default UserLoginPage;