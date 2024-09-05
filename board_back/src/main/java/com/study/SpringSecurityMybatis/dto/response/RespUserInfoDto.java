package com.study.SpringSecurityMybatis.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Builder
@Data
public class RespUserInfoDto {
    private Long userId;
    private String username;
    private String name;
    private String email;
    private String img;
    private Set<String> roles;
}
