package com.study.SpringSecurityMybatis.init;

import com.study.SpringSecurityMybatis.entity.Board;
import com.study.SpringSecurityMybatis.entity.User;
import com.study.SpringSecurityMybatis.entity.UserRoles;
import com.study.SpringSecurityMybatis.repository.BoardMapper;
import com.study.SpringSecurityMybatis.repository.UserMapper;
import com.study.SpringSecurityMybatis.repository.UserRolesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;


public class SampleDataInit implements CommandLineRunner {

    @Autowired
    private BoardMapper boardMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private UserRolesMapper userRolesMapper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;



    @Override
    public void run(String... args) throws Exception {
        List<User> users = new ArrayList<>();

        for(int i = 0; i < 20; i++) {
            User user = User.builder()
                    .username("user" + (i + 1))
                    .password(passwordEncoder.encode("1q2w3e4r!!A"))
                    .name("김준" + (i + 1))
                    .email("user" + (i + 1) + "@gmail.com")
                    .build();

            userMapper.save(user);
            userRolesMapper.save(UserRoles.builder()
                            .userId(user.getId())
                            .roleId(1l)
                            .build());
            users.add(user);
        }

        Random random = new Random();

        for( int i = 0; i < 436; i++) {
            int randomIndex = random.nextInt(20);

            boardMapper.save(Board.builder()
                            .userId(users.get(randomIndex).getId())
                            .title("테스트 게시글 제목" + i )
                            .content("<p>테스트</p>")
                            .build());
        }

    }
}
