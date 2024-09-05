package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.ReqOAuth2SubmitDto;
import com.study.SpringSecurityMybatis.dto.response.RespSignupDto;
import com.study.SpringSecurityMybatis.entity.Role;
import com.study.SpringSecurityMybatis.entity.User;
import com.study.SpringSecurityMybatis.entity.UserRoles;
import com.study.SpringSecurityMybatis.exception.SignupException;
import com.study.SpringSecurityMybatis.repository.OAuth2UserMapper;
import com.study.SpringSecurityMybatis.repository.RoleMapper;
import com.study.SpringSecurityMybatis.repository.UserMapper;
import com.study.SpringSecurityMybatis.repository.UserRolesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
public class OAuth2Service implements OAuth2UserService {

    @Autowired
    private DefaultOAuth2UserService defaultOAuth2UserService;
    @Autowired
    private OAuth2UserMapper oAuth2UserMapper;
    @Autowired
    private UserService userService;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private UserRolesMapper userRolesMapper;
    @Autowired
    private RoleMapper roleMapper;


    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = defaultOAuth2UserService.loadUser(userRequest);
        // OAuth2UserRequest 얘는 SecurityConfig 에서 생성된 애인데 provider랑 토큰 정보를 가지고 있다
        // 구글, 네이버, 카카오 로그인창으로 입력한 정보를 가지고옴 -> 얘는 principal

//        System.out.println(userRequest.getClientRegistration());
//        System.out.println(oAuth2User.getAttributes());
//        System.out.println(oAuth2User.getAuthorities());
//        System.out.println(oAuth2User.getName()); // 이게 중요!! 이걸로 계정마다 연동시킬거야


        // 네이버가 아니면 바로 getName 으로 id 가져올 수 있음
        // 네이버는 oAuth2User.getAttribute() 가 {resultcode=00, message=success, response={id=8ESMET 어쩌구}}
        // 구글은 oAuth2User.getAttribute() 가 {sub=어쩌구우우우}
        // 카카오는 oAuth2User.getAttribute() 가 {id=어쩌구구구}
        Map<String, Object> attributes = oAuth2User.getAttributes();

        Map<String, Object> oAuth2Attributes = new HashMap<>();

        // userRequest.getClientRegistration().getClientName() 는 Google 또는 Naver 또는 Kakao
        // provider 키값에 userRequest.getClientRegistration().getClientName() 값 넣기
        // 구글,네이버,카카오에서 가져온 user정보에 provider랑 id 추가
        oAuth2Attributes.put("provider", userRequest.getClientRegistration().getClientName());

        switch (userRequest.getClientRegistration().getClientName()) {
            case "Google":
                oAuth2Attributes.put("id", attributes.get("sub").toString());
                break;

            case "Naver":
                attributes = (Map<String, Object>) attributes.get("response"); // response만 꺼낸다 -> 네이버는 id 가 response={id=어쩌구어쩌구} 형태라서, 다른애들은 바로 {id있음}
                oAuth2Attributes.put("id", attributes.get("id").toString());
                break;

            case "Kakao":
                oAuth2Attributes.put("id", attributes.get("id").toString());
                break;
        }

        return new DefaultOAuth2User(new HashSet<>(), oAuth2Attributes, "id"); // 이떄 authentication 객체 생성됨 ( principal 가지고있음, Oauth2SuccessHandler에서 사용 )
    }

    public void merge(com.study.SpringSecurityMybatis.entity.OAuth2User oAuth2User) {
        oAuth2UserMapper.save(oAuth2User);
    }


    // 회원가입
    @Transactional(rollbackFor = Exception.class)
    public void signup(ReqOAuth2SubmitDto dto) {
        User user = dto.toEntity(passwordEncoder);
        userMapper.save(user);

        Role role = roleMapper.findByName("ROLE_USER");
        if (role == null) {
            role = Role.builder().name("ROLE_USER").build(); // 바로 save에 넣어주지 않고 뺴주는 이유 = 이래야 PK 가 생김 ? ? ? ? ?
            roleMapper.save(role);
        }

        UserRoles userRoles = UserRoles.builder()
                .userId(user.getId())
                .roleId(role.getId())
                .build();
        userRolesMapper.save(userRoles);
        user.setUserRoles(Set.of(userRoles));


        com.study.SpringSecurityMybatis.entity.OAuth2User oAuth2User = com.study.SpringSecurityMybatis.entity.OAuth2User.builder()
                .userId(user.getId())
                .oAuth2Name(dto.getOauth2Name())
                .provider(dto.getProvider())
                .build();

        oAuth2UserMapper.save(oAuth2User);
    }
}

