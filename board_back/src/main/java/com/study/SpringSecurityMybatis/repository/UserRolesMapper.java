package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.UserRoles;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserRolesMapper {
    int save(UserRoles userRoles);
    int deleteByUserId(Long userId);
}
