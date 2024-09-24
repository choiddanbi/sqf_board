package com.study.SpringSecurityMybatis.dto.request;

import lombok.Data;

@Data
public class ReqSendMailDto {
    private String toEmail;
    private String subject;
    private String content;
}
