import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { instance } from '../../apis/util/instance';

function OAuth2LoginPage(props) {
    const [ searchParams ] = useSearchParams(); // url 의 params 값 가져오기
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        if(!accessToken) { // accessToken 없이 주소창을 통해서 들어가면
            alert("잘못된 접근입니다.");
            navigate("/user/login");
            return;
        }
        localStorage.setItem("accessToken", "Bearer " + accessToken);
        instance.interceptors.request.use(config => { // interceptors가 실행되면 App.js 재실행
            config.headers["Authorization"] = localStorage.getItem("accessToken") 
            return config;
        });
        navigate("/");
    }, []);

    
    return (
        <></>
    );
}

export default OAuth2LoginPage;