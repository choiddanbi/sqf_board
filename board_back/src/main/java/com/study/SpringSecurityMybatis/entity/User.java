package com.study.SpringSecurityMybatis.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.study.SpringSecurityMybatis.security.principal.PrincipalUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class User {
    private Long id;
    private String username;
    @JsonIgnore
    private String password;
    private String name;
    private String email;
    private String img;
    private Set<OAuth2User> oAuth2Users; // 하나의 user가 여러개의 oAuth2User 를 가질 수 있으니까!!
    private Set<UserRoles> userRoles; // 이걸 만든 이유 : springboot 에서는 db처럼 조인이 없어서!!

    public PrincipalUser toPrincipal() {
        return PrincipalUser.builder()
                .id(id)
                .username(username)
                .password(password)
                .roles(userRoles)
                .build();
    }
}








