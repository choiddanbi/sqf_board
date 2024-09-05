package com.study.SpringSecurityMybatis.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserRoles {
    // userRoles 을 만든 이유
    // User 랑 Role 은 다대다 관계인데 springboot 에서 다대다 표현이 안됨
    // 그래서 중간테이블을 만들어서 user - userroles 일대다, role - userroles 일대다 이렇게 연결 시켜줌
    private Long id;
    private Long userId;
    private Long roleId;
    private Role role;


}
