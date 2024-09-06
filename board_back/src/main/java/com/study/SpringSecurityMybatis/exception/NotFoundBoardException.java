package com.study.SpringSecurityMybatis.exception;

public class NotFoundBoardException extends RuntimeException{

    // ctrl + o
    public NotFoundBoardException(String message) {
        super(message);
    }
}
