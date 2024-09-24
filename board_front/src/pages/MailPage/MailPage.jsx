import { css } from '@emotion/react';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import { instance } from '../../apis/util/instance';
import { RingLoader } from 'react-spinners';
/** @jsxImportSource @emotion/react */

const layout = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 50px auto;
    width: 700px;

    & * {
        box-sizing: border-box;
        margin-bottom: 10px;
        padding: 10px 15px;
        width: 100%;
        font-size: 16px;
    }

    & input,
    & button {
        height: 40px;
    }

    & textarea {
        height: 500px;
    }
`;


const loadingLayout = css`
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;
    width: 100%;
    height: 100%;
    background-color: #00000033;
`;


function MailPage(props) {

    const [ mailData, setMailData ] = useState({
        toEmail: "",
        subject: "",
        content: ""
    });

    const sendMail = useMutation(
        async () => instance.post("/email", mailData),
        {
            onSuccess: response => {
                alert("메일 전송 성공");
                window.location.reload();
            },

            onError: error => {
                alert("메일 전송 실패");
            }
        }
    );


    const handleInputOnChange = (e) => {
        setMailData(mailData => ({
            ...mailData,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div css={layout}>
            {
                sendMail.isLoading 
                    ? 
                    <div css={loadingLayout}>
                        <RingLoader />
                    </div>
                    :
                    <></>
            }

            <Link to={"/"}><h1>메인 페이지</h1></Link>
            <input type="text" name='toEmail' placeholder='받는 사람' 
                onChange={handleInputOnChange} value={mailData.toEmail} />

            <input type="text" name='subject' placeholder='제목' 
                onChange={handleInputOnChange} value={mailData.subject} />

            <textarea name="content" 
                onChange={handleInputOnChange} value={mailData.content} ></textarea>

            <button onClick={() => sendMail.mutateAsync()}>전송</button>
        </div>
    );
}

export default MailPage;