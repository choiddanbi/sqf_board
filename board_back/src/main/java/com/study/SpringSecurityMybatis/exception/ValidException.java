package com.study.SpringSecurityMybatis.exception;

import lombok.Data;
import lombok.Getter;
import org.springframework.validation.FieldError;

import java.util.List;

@Data
public class ValidException extends RuntimeException {

    // fieldErrors 를 외부에서 쓰려고 ( Controller 에서 사용 )
    @Getter
    private List<FieldError> fieldErrors;

    // 생성자 ctrl + o
    // message 와 fieldErrors 중 fieldErrors 만 뽑 아 씀 !
    public ValidException(String message, List<FieldError> fieldErrors) {
        super(message);
        this.fieldErrors = fieldErrors;
    }
}
