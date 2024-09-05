package com.study.SpringSecurityMybatis.security.handler;

import com.study.SpringSecurityMybatis.entity.User;
import com.study.SpringSecurityMybatis.repository.UserMapper;
import com.study.SpringSecurityMybatis.security.jwt.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.SimpleTimeZone;

@Component
public class Oauth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        //System.out.println(authentication.getName());
        DefaultOAuth2User defaultOAuth2User = (DefaultOAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = defaultOAuth2User.getAttributes();
        String oAuth2Name = attributes.get("id").toString();
        String provider = attributes.get("provider").toString();

        // oauth2 로 로그인 성공했을 때 동작
        // 통합로그인 했을 때 내 oAuth2Name 으로 (고유 id) user 찾아오는데
        User user = userMapper.findByOAuth2Name(authentication.getName());
        if(user == null) { // user에 oauth가 없으면 회원가입페이지로
            response.sendRedirect("http://localhost:3000/user/join/oauth2?oAuth2Name=" + oAuth2Name + "&provider=" + provider); // 강제 페이지 이동
            return;
        }

        // user가 있으면 토큰 생성해서 login 페이지로
        String accessToken = jwtProvider.generateAccessToken(user);
        response.sendRedirect("http://localhost:3000/user/login/oauth2?accessToken=" + accessToken);
    }
}

