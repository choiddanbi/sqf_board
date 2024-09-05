package com.study.SpringSecurityMybatis.dto.request;

import com.study.SpringSecurityMybatis.entity.User;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.validation.constraints.NotBlank;

@Data
public class ReqOAuth2SubmitDto {
    @NotBlank(message = "사용자이름을 입력해 주세요.")
    private String username;
    @NotBlank(message = "비밀번호를 입력해 주세요.")
    private String password;
    private String checkPassword;

    @NotBlank(message = "이름을 입력해 주세요.")
    private String name;
    @NotBlank(message = "이메일을 입력해 주세요.")
    private String email;
    @NotBlank(message = "OAuth2이름을 입력해 주세요.")
    private String oauth2Name;
    @NotBlank(message = "제휴사명을 입력해 주세요.")
    private String provider;

    public User toEntity(BCryptPasswordEncoder passwordEncoder) {
        return User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .name(name)
                .email(email)
                .build();
    }

}
