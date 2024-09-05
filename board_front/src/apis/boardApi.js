import { instance } from "./util/instance";

export const boardApi = async (board) => {
    let boardData = {
        isSuccess: false,
        boardId : 0
    }

    try {
        const response = await instance.post("/board", board);
        boardData = {
            isSuccess: true,
            boardId: response.data
        }
    } catch (error) {
        console.error(error.response.data);
        const response = error.response;
        boardData = {
            isSuccess: false,
    }
}

    return boardData;
}