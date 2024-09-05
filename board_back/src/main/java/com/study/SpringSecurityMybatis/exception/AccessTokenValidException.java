package com.study.SpringSecurityMybatis.exception;

public class AccessTokenValidException extends RuntimeException {

    public AccessTokenValidException(String message) {
        super(message);
    }
}
