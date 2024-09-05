import React, { useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQueryClient } from 'react-query';
import { storage } from '../../firebase/firebase';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import "react-sweet-progress/lib/style.css";
import { Progress } from 'react-sweet-progress';
import { updateProfileImgApi } from '../../apis/userApi';


const imgBox = css`
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 200px;
    height: 200px;
    box-shadow: 0px 0px 2px #00000088;
    cursor: pointer;
    overflow: hidden;

    & > img {
        height: 100%;;
    }
`;

const layout = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 100px auto;
    width: 1000px;
`;

const progressBox = css`
    padding-top: 20px;
    width: 300px;
`;


function UserProfilePage(props) {
    const queryClient = useQueryClient();
    const userInfoState = queryClient.getQueryState("usst fileInput = document.createrInfoQuery");
    const [ uploadPercent, setUploadPercent ] = useState(0);


    const handleImageOnChange = () => {
        if(window.confirm("프로필 사진을 변경하시겠습니까 ?")) {
            const fileInput = document.createElement("input"); // dom객체 생성
            fileInput.setAttribute("type", "file"); // input 속성을 file 로 변경
            fileInput.setAttribute("accept", "image/*"); // 이미지 외에는 업로드 못하게
            fileInput.click();

            fileInput.onchange = (e) => {
                const files = Array.from(e.target.files);
                // console.log(files);

                const profileImage = files[0];
                setUploadPercent(0); // 0% 로 초기화


                // uuid 사용 이유 - 사용자마다 같은 이미지를 사용하더라도 겹치지 않게 하기위해서?
                const storageRef = ref(storage, `user/profile/${uuid()}_${profileImage.name}`); // firebase storage 에 접근하겠ㄸ따!
                const uploadTask = uploadBytesResumable(storageRef, profileImage);
                uploadTask.on(
                    "state_changed", // 업로드 중.. 이벤트명
                    (snapshot) => { // snapshot 함수, 사진 업로드 될 때마다 호출됨 ( 캡쳐뜸 )
                        setUploadPercent(
                            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        ); // 상태로 줘서 사진 업로드 때마다 재랜더링
                        // console.log(snapshot.totalBytes); // 실제 전체 파일 데이터 
                        // console.log(snapshot.bytesTransferred); // 현재 전송중인 데이터 
                    },
                    (error) => { // 에러 발생..
                        console.log(error);
                    },
                    async (success) => { // 업로드 완료!
                        const url = await getDownloadURL(storageRef); // 사진의 url 받아옴
                        const response = await updateProfileImgApi(url); // 그 url을 db에 추가
                        queryClient.invalidateQueries(["userInfoQuery"]); // 해당 쿼리 강제 만료 -> 쿼리를 다시 요청 날리게 됨 (userinfo 다시 들고옴)

                        // 아래의 코드로도 작성 가능
                        // const fileUrl = getDownloadURL(storageRef) // 얘가 Promise임 얘 먼저 실행 -> 응답 오면 then 실행
                        // .then(url => {
                        //     const profile = {
                        //         img: url
                        //     }
                        //     //console.log(url); // 사진의 url -> db에 추가
                        // });
                        // console.log(fileUrl);
                    }
                );
            }
        }
    }
    
    // 기본 이미지로 수정
    const handleDefaultImgChangeOnClick = async () => {
        if(window.confirm("기본 이미지로 변경하겠습니까?")) {
            await updateProfileImgApi("");
            queryClient.invalidateQueries(["userInfoQuery"]); 
        }
    }

    return (
        <div css={layout}>
            <h1>프로필</h1>
            <div css={imgBox} onClick={handleImageOnChange}>
                {/* src 는 firebase 홈페이지의 storage 사진 클릭 시 생기는 url */}
                <img src={userInfoState?.data?.data.img} alt="" />
            </div>
            <div css={progressBox}>
                <Progress percent={uploadPercent} status={uploadPercent !== 100 ? "active" : "success"} />
            </div>
            <div>
                <button onClick={handleDefaultImgChangeOnClick}>기본 이미지로 변경</button>
            </div>
        </div>
    );
}

export default UserProfilePage;