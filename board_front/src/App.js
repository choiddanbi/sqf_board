import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import IndexPage from "./pages/IndexPage/IndexPage";
import UserJoinPage from "./pages/UserJoinPage/UserJoinPage";
import UserLoginPage from "./pages/UserLoginPage/UserLoginPage";
import { instance } from "./apis/util/instance";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import OAuth2JoinPage from "./pages/OAuth2JoinPage/OAuth2JoinPage";
import OAuth2LoginPage from "./pages/OAuth2LoginPage/OAuth2LoginPage";
import WritePage from "./pages/BoardPages/WritePage/WritePage";
import DetailPage from "./pages/BoardPages/DatailPage/DetailPage";
import NumberBoardListPage from "./pages/BoardPages/NumberBoardListPage/NumberBoardListPage";
import ScrollBoardListPage from "./pages/BoardPages/ScrollBoardListPage/ScrollBoardListPage";
import SearchBoardPage from "./pages/BoardPages/SearchBoardPage/SearchBoardPage";
import MailPage from "./pages/MailPage/MailPage";

/** 
 * 페이지 이동 시 Auth(로그인, 토큰) 확인
 *  1. index(home) 페이지 먼저 들어가서 '로그인 페이지'로 이동한 경우 : 로그인 후 -> index(home) 으로 이동  
 *      // history 3개 : 탭 -> 인덱스 -> login
 *  2. 탭을 열자마자 주소창에 수동입력을 통해 '로그인 페이지'로 이동한 경우 : 로그인 후 -> index(home) 으로 이동 
 *      // history 2개 : 탭 -> login
 *  3. 로그인을 하지 않고 로그인 해야만 사용 가능한 페이지로 들어갔을 때 '로그인 페이지'로 이동된 경우 : 로그인 후 -> 이전페이지 ( = 접속하고자 했던 페이지로 이동 )
 *      // history 3개 : 탭 -> profile -> login
 *  4. 로그인이 된 상태 -> 어느 페이지든 이동
*/

// ()가 바로 붙은 애들은 바로 실행, 나머지는 정의!
// 총 실행 순서 : 그냥 출력 -> 정의 -> useQuery async -> useEffect -> useQuery onSuccess 또는 onError
function App() {

    // 정의
    const location = useLocation();
    const navigate = useNavigate();
    const [ authRefresh, setAuthRefresh ] = useState(true);

    // 정의 -> 마운트 되어야 실행인데 authRefresh가 false니까 실행 안됨
    useEffect(() => {
        if(!authRefresh) {
            setAuthRefresh(true);
        }
    }, [location.pathname]);
    
    // useQuery(["key"], 요청메소드, 객체) --> 선언만 해두면 호출, 실행 없이 최초에 한번은 무조건 실행됨 (useeffect 처럼)
    // 단 enable=false 면 안함
    // useQuery는 자동으로 서버(springboot) 에 요청보내서 정보 가져오는 용도 -> get요청에 주로 사용
    // useMutation -> post, delete, put
    // 이건 실행이 아닌 정의 - usequery는 실행 그 안에 애들은 정의


    // token 을 localStorage 에서 꺼내오는 react-query -> localStorage 는 user마다 개별임 ( 즉, localStorage 의 accesstoken 은 하나만 존재 )
    // 로그인 이력 확인, 내 토큰이 사용가능한 토큰인지 확인용
    // 정의
    const accessTokenValid = useQuery(
        ["accessTokenValidQuery"],  // ["KEY", dependency] // dependency 가 변하면 springboot로 다시 요청 보낸다 
        async () => {
            setAuthRefresh(false);
            return await instance.get("/auth/access", {
                params: { // params를 쓰면 pathvariable이나 requestbody 안해도 됨 => springboot한테 요청 보내는데 이때 보내는 정보가 localstorage 에서 꺼낸 accesstoken
                    accessToken: localStorage.getItem("accessToken")
                }
            }); 
        }, { // springboot 에서 응답이 와야 실행
            enabled: authRefresh,
            retry: 0, // 응답이 false일 때 재시도를 안하겠다는 뜻, default = 3임
            refetchOnWindowFocusindow : false, // 다른 탭에 갔다가 지금 윈도우로 돌아왔을 때 재요청 보내지 않겠따! retry : 요청실패 시 같은 요청으로 재요청 , refetch : 완전 새로운 요청
            onSuccess: response => { // 토큰이 유용한 상태에서 ( 로그인이 되어져 있따면 ) 주소창에 로그인페이지 or 회원가입으로 접속하면 인덱스페이지 이동!
                const permitAllPaths = ["/user"];
                for(let permitAllPath of permitAllPaths) {
                    if(location.pathname.startsWith(permitAllPath)) {
                        navigate("/");
                        break;
                    }
                }
            },
            onError: error => { // 토큰이 유용하지 않다면 ( 로그인 안됐는데 = 토큰이 유용하지 않은데 auth 들어오려고 하면 로그인페이지로 )
                const authPaths = ["/profile"];
                for(let authPath of authPaths) {
                    if(location.pathname.startsWith(authPath)) { // authPaths 로 시작하는 경로 ( /profile 경로로 가면 )
                        //window.location.href=""; // 뒤로가기 됨, location.replace = 뒤로가기 안됨, 
                        navigate("/user/login"); // navigate 랑 window.location 차이 : navigate (상태유지 o, 재랜더링 안됨), location.어쩌구 (상태유지x, 완전 새로운 페이지)
                        break;
                    }
                }
            }
        }
    );

    // 위에 accessTokenValidQuery 가 success 일때 이거 요청보냄
    // springboot 로 get요청 보내는 react-query
    // 사용 가능한 토큰이면 토큰ID로 user 가져오기
    // 정의
    const userInfo = useQuery(
        ["userInfoQuery"],
        async () => {
            return await instance.get("/user/me");
        },
        { // springboot 에서 응답이 와야 실행
            enabled: accessTokenValid.isSuccess && accessTokenValid.data?.data, 
            refetchOnWindowFocusindow :false
        }
    );

    return (
        <Routes>
            <Route path="/" element={ <IndexPage /> }/>
            <Route path="/mail" element={ <MailPage /> }/>
            <Route path="/user/join" element={ <UserJoinPage /> }/>
            <Route path="/user/join/oauth2" element={ <OAuth2JoinPage /> }/>
            
            <Route path="/user/login" element={ <UserLoginPage /> }/>
            <Route path="/user/login/oauth2" element={ <OAuth2LoginPage />}/>
            <Route path="/profile" element={ <UserProfilePage /> } />

            <Route path="/board/search" element={ <SearchBoardPage /> } /> 
            <Route path="/board/number" element={ <NumberBoardListPage /> } /> 
            <Route path="/board/scroll" element={ <ScrollBoardListPage /> } />
            <Route path="/board/detail/:boardId" element={ <DetailPage />} />
            <Route path="/board/write" element={ <WritePage /> } />

            <Route path="/admin/*" element={ <></> }/>
            <Route path="/admin/*" element={ <h1>Not Found</h1> }/>
            <Route path="*" element={ <h1>Not Found</h1> }/>
        </Routes>
    );
}

export default App;
