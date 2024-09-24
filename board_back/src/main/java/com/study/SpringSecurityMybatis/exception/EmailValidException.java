package com.study.SpringSecurityMybatis.exception;

import lombok.Getter;

public class EmailValidException extends RuntimeException {

    @Getter
    private String email;

    public EmailValidException(String email) {
        super("이메일 인증 후 이용바랍니다. 이메일 인증 메일을 다시 받으시려면 확인을 눌러주세요 ~ ");
        this.email = email;
    }
}
