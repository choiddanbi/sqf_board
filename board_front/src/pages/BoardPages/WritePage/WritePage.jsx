import { css } from '@emotion/react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';
import { v4 as uuid } from "uuid";
import { storage } from '../../../firebase/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { RingLoader } from 'react-spinners';
import { boardApi } from '../../../apis/boardApi';
import { useNavigate } from 'react-router-dom';
Quill.register("modules/imageResize", ImageResize);
/** @jsxImportSource @emotion/react */

const layout = css`
    box-sizing: border-box;
    padding-top: 30px;
    margin: 0 auto;
    width: 1100px;
`;

const header = css`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 10px 0px;

    & > h1 {
        margin: 0;
    }

    & > button {
        box-sizing: border-box;
        border: 1px solid #c0c0c0;
        padding: 6px 15px;
        background-color: white;
        font-size: 12px;
        color: #333333;
        font-weight: 600;
        cursor: pointer;
        &:hover {
            background-color: #fafafa;
        }
        &:active {
            background-color: #eeeeee;
        }
    }
`;

const titleInput = css`
    box-sizing: border-box;
    margin-bottom: 10px;
    border: 1px solid #c0c0c0;
    outline: none;
    padding: 12px 15px;
    width: 100%;    
    font-size: 16px;
`;

const editorLayout = css`
    box-sizing: border-box;
    margin-bottom: 42px; // 필수 안그러면 넘ㄱ침..
    width: 100%;
    height: 700px;
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


function WritePage(props) {
    // springboot 에서 주는 이름이랑 맞춰줘야함 
    const navigate = useNavigate();

    const [ board, setBoard ] = useState({
        title: "",
        content: ""
    });
    
    const quillRef = useRef(null);
    const [ isUploading, setUploading ] = useState(false);



    const handleWriteSubmitOnClick = async () => {
        // console.log(board);
        const boardData = await boardApi(board);
        // instance.post("/board", board); 로도 가능
        if(!boardData.isSuccess) {
            alert("오류");
            return;
        }
        alert("성공");
        // console.log(boardData);
        navigate(`/board/detail/${boardData.boardId.id}`); 
    }

    
    // const handleWriteSubmitOnClick2 = async () => {
    //     instance.post("/board", board) 

    //     .then((response) => {
    //         alert("작성 완료");
    //         navigate(`/board/detail/${response.data.boardId}`);
    //     })
    //     .catch((error) => {
    //         console.error(error); // 오류 처리
    //         const fieldErrors = error.response.data;

    //         for (let fieldError of fieldErrors) {
    //             if (fieldError.field === "title") {
    //                 alert(fieldError.defaultMessage);
    //                 return;
    //             }
    //         }
    //         for (let fieldError of fieldErrors) {
    //             if (fieldError.field === "content") {
    //                 alert(fieldError.defaultMessage);
    //                 return;
    //             }
    //         }
    //     });
    // }


    const handleTitleInputOnChange = (e) => {
        setBoard(board => ({
            ...board,
            [e.target.name]: e.target.value
        }));
    }

    const handleQuillValueOnChange = (value) => {
        setBoard(board => ({
            ...board,
            content: value //quillRef.current.getText().trim() === "" ? "" : value // value 
        }));
    }

    // useCallback : 랜더링 될 때 얘는 다시 정의되지 않음!!
    // quill 에서 제공되는 이미지 업로드 를 ㅅㅏ용하지 않고 내가 재정의해서 쓰겠다
    const handleImageLoad = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.click();

        input.onchange = () => {
            const editor = quillRef.current.getEditor(); // getEditor ㅎㅏ면 editor 객체를 가져옴
            const files = Array.from(input.files); // input에 입력된 이미지를 array로 변환!
            const imgFile = files[0]; // 첫번째 이미지 들고옴 ( 요건 무조건 ~ )

            const editPoint = editor.getSelection(true); // 맨 위 맨 왼쪽을 커서 시작점으로 잡음

            // storage는 firebase에 있는거얌
            const storageRef = ref(storage, `board/img/${uuid()}_${imgFile.name}`);
            const task = uploadBytesResumable(storageRef, imgFile); // 해당 경로에 이미지파일을 올려라
            setUploading(true);
            task.on(
                "state_changed",
                () => {}, // snapshot
                () => {}, // error
                async () => { // success
                    const url = await getDownloadURL(storageRef); // firebase에서 url 가져와서 
                    editor.insertEmbed(editPoint.index, "image", url); // url에 해당하는 이미지 첨부
                    editor.setSelection(editPoint.index + 1); // 커서를 첨부된 이미지 끝으로 이동
                    editor.insertText(editPoint.index + 1, "\n"); // 줄바꿈
                    setUploading(false);
                    // setBoard(board => ({
                    //     ...board,
                    //     content: editor.root.innerHTML
                    // })); // handleQuillValueOnChange 위에 value 를 quill로 넣으면 이걸 해줘야하ㅡ는데 난 안됑....
                } 
            );

            // console.log(input.files); // FileList 로 해당 이미지에 대한 정보가 객체로 담겨있음
            // const files = Array.from(input.files); // 객체를 Array로 변환
            // const reader = new FileReader();

            // reader.onload = (e) => { // URL 을 읽으면 그떄 이거 동작
            //     console.log(e.target.result); // 이미지 URL 찍힘
            // }

            // reader.readAsDataURL(files[0]); // 첫번째 이미지의 URL 을 읽어라
        }

    },[]);


    const toolbarOptions = useMemo(() => [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike'],        
        [{ 'color': [] }, { 'background': [] }, { 'align': [] }],          
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],          
        ['link', 'image', 'video', 'formula'],
        ['blockquote', 'code-block'],
        ], []);

        const quill = new Quill('#editor', {
        modules: {
            toolbar: toolbarOptions
        },
        theme: 'snow'
    });

    return (
        <div css={layout}>
            <header css={header}>
                <h1>Quill Edit</h1>
                <button onClick={handleWriteSubmitOnClick}>작성하기</button>
            </header>

            <input css={titleInput} type="text" onChange={handleTitleInputOnChange} name="title" value={board.title} placeholder="게시글의 제목을 입력하세요..." />
            <div css={editorLayout}>
                    {
                        isUploading && 
                        <div css={loadingLayout}>
                            <RingLoader />
                        </div>
                    }
                <ReactQuill 
                    ref={quillRef}
                    style={{
                        boxSizing: "border-box",
                        width: "100%",
                        height: "100%"
                    }}
                    onChange={handleQuillValueOnChange}
                    modules={{
                        toolbar: {
                            container: toolbarOptions,
                            handlers: {
                                image: handleImageLoad,
                            }
                        },
                        imageResize: {
                            Parchment: Quill.import("parchment")
                        },
                        
                    }}
                />
            </div>
            {/* <button>확인</button> */}
        </div>
    );
}

export default WritePage;