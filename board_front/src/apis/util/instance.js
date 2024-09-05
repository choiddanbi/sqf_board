import axios from "axios";

// 최초 로그인이면 localStorage = null
// 유효한 토큰으로 로그인 이력이 있다면 localStorage = 값이 있음
export const instance = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        Authorization: localStorage.getItem("accessToken"),
    }
});