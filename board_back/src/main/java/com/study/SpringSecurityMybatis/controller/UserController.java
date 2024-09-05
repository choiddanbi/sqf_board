package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.dto.request.ReqProfileImgDto;
import com.study.SpringSecurityMybatis.security.principal.PrincipalUser;
import com.study.SpringSecurityMybatis.service.UserService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    // 요청 들어온 토큰 id로 getUser
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return ResponseEntity.ok().body(userService.getUserInfo(id));
    }


    // 저장된 토큰의 id로 getUser
    // claims → principalUser → UsernamePasswordAuthenticationToken → SecurityContextHolder.getContext().setAuthentication(UsernamePasswordAuthenticationToken)
    @GetMapping("/user/me")
    public ResponseEntity<?> getUserMe() {
        PrincipalUser principalUser =
                (PrincipalUser) SecurityContextHolder
                .getContext()
                .getAuthentication() // UsernamePasswordAuthenticationToken
                .getPrincipal();
        return ResponseEntity.ok().body(userService.getUserInfo(principalUser.getId()));
        // principalUser.getId() = claims 의 userid 즉, 토큰의 payload 부분
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok().body(userService.deleteUser(id));
    }

    // put을 사용하지 않고 patch 를 사용하는 이유 :
    // patch는 null 을 허용하지 않는다 ( 만약 이미지가 빈 값으로 들어오면 default img 로 바꿔주려고 )
    @PatchMapping("/user/img")
    public ResponseEntity<?> updateProfileImg(@RequestBody ReqProfileImgDto dto) {
        return ResponseEntity.ok().body(userService.updatePprofileImg(dto));
    }
}
