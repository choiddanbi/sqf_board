package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.dto.request.ReqOAuth2SubmitDto;
import com.study.SpringSecurityMybatis.entity.OAuth2User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OAuth2UserMapper {
    int save(OAuth2User oAuth2User);
}
