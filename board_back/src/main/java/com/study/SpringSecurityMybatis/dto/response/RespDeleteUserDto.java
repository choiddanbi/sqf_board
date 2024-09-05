package com.study.SpringSecurityMybatis.dto.response;

import com.study.SpringSecurityMybatis.entity.User;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RespDeleteUserDto {
    private Boolean isDeleting;
    private String message;
    private User deletedUser;
}
