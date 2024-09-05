package com.study.SpringSecurityMybatis.dto.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ReqOAuth2MergeDto {
    @NotBlank(message = "사용자이름을 입력해 주세요.")
    private String username;
    @NotBlank(message = "비밀번호를 입력해 주세요.")
    private String password;
    @NotBlank(message = "OAuth2이름을 입력해 주세요.")
    private String oauth2Name;
    @NotBlank(message = "제휴사명을 입력해 주세요.")
    private String provider;
}
