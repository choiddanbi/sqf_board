package com.study.SpringSecurityMybatis.config;

import com.study.SpringSecurityMybatis.security.filter.JwtAccessTokenFilter;
import com.study.SpringSecurityMybatis.security.handler.AuthenticationHandler;
import com.study.SpringSecurityMybatis.security.handler.Oauth2SuccessHandler;
import com.study.SpringSecurityMybatis.security.jwt.JwtProvider;
import com.study.SpringSecurityMybatis.service.OAuth2Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtAccessTokenFilter jwtAccessTokenFilter;
    @Autowired
    private AuthenticationHandler authenticationHandler;
    @Autowired
    private Oauth2SuccessHandler oauth2SuccessHandler;
    @Autowired
    private OAuth2Service oAuth2Service;

//    @Autowired
//    private BCryptPasswordEncoder passwordEncoder;

//    @Bean
//    public BCryptPasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin().disable();
        http.httpBasic().disable();
        http.csrf().disable(); // 토큰 사용 안함
        http.headers().frameOptions().disable(); // h2-console 접속용
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS); // 세션저장소 사용 안함
        http.cors(); // 서버가 달라고 응답 주고받겠다 -> WebMvcConfig 설정 따라감

        http.oauth2Login()
                        .successHandler(oauth2SuccessHandler)
                        .userInfoEndpoint() // 구글 로그인을 하면 얘가 동작해서 구글에서 받아온 user 정보를 가지고 OAuth2UserRequest 생성 ( 토큰이랑 provider 정보 담고있음 ) -> OAuth2Service
                        .userService(oAuth2Service);

        http.exceptionHandling().authenticationEntryPoint(authenticationHandler); // 인증 관련 된 예외가 터지면 authenticationHandler 한테 던지겠다

        http.authorizeRequests()
                .antMatchers("/auth/**", "/h2-console/**")
                .permitAll()
                .anyRequest()
                .authenticated();

        http.addFilterBefore(jwtAccessTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }

}
