package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    User findById(Long id);
    User findByUsername(String username);
    User findByOAuth2Name(String oAuth2Name);
    int save(User user);
    int deleteById(Long id);
    int modifyImgById(@Param("id") Long id, @Param("img") String img);
}
