package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.Role;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RoleMapper {
    int save(Role role);
    Role findByName(String name);
    Role findById(Long id);
}
