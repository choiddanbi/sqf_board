package com.study.SpringSecurityMybatis.security.filter;

import com.study.SpringSecurityMybatis.entity.User;
import com.study.SpringSecurityMybatis.repository.UserMapper;
import com.study.SpringSecurityMybatis.security.jwt.JwtProvider;
import com.study.SpringSecurityMybatis.security.principal.PrincipalUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Component
public class JwtAccessTokenFilter extends GenericFilter {

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private UserMapper userMapper;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;

        String bearerAccessToken = request.getHeader("Authorization");

        if(bearerAccessToken == null || bearerAccessToken.isBlank()) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        String accessToken = jwtProvider.removeBearer(bearerAccessToken);
        Claims claims = null;
        try {
            // claims = 토큰의 paylod 부분
            claims = jwtProvider.getClaims(accessToken);
            Long userId = ((Integer) claims.get("userId")).longValue();
            User user = userMapper.findById(userId);
            if(user == null) {
                throw new JwtException("해당 ID(" + userId + ")의 사용자 정보를 찾지 못했습니다.");
            }

            // Principal = 토큰 검사를 통과한 객체, UsernamePasswordAuthenticationToken 객체 생성 시 사용
            PrincipalUser principalUser = user.toPrincipal();
            Authentication authentication = new UsernamePasswordAuthenticationToken(principalUser, null, principalUser.getAuthorities());

            // UsernamePasswordAuthenticationToken 객체를 생성해서
            // SecurityContextHolder.getContext어쩌구 에 담음
            SecurityContextHolder.getContext().setAuthentication(authentication);
            /*
               1. claims 는 토큰의 payload 부분인데 userId를 가지고 있음
               2. claims 를 담고 있는게 principalUser 인데 토큰검사를 통과한 user
               3. UsernamePasswordAuthenticationToken 는 principalUser를 담고있음
                그래서 1 2 3 모두 userId 를 가지고 있음
            * */
            
        } catch (JwtException e) {
            e.printStackTrace();
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        // 다음 필터인 UsernamePasswordAuthenticationFilter 동작
        filterChain.doFilter(servletRequest, servletResponse);
    }

}
