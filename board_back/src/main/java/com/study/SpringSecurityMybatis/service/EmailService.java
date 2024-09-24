package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.ReqSendMailDto;
import com.study.SpringSecurityMybatis.entity.User;
import com.study.SpringSecurityMybatis.repository.UserMapper;
import com.study.SpringSecurityMybatis.security.jwt.JwtProvider;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;

@Service
public class EmailService {
    // .yml 에 있는 값 들고오기
    @Value("${spring.mail.username}")
    private String fromEmail;
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private JwtProvider jwtProvider;
    @Autowired
    private UserMapper userMapper;


    public Boolean send(String toEmail, String fromEmail, String subject, String content) {
        // email 을 보내려면 MimeMessage 를 만들어야함
        MimeMessage message = javaMailSender.createMimeMessage();

        // 멀티파트 false -> 멀티파트란 ? 이메일 안에서 이미지 전송 가능하게 해주는 애
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "utf-8");
            helper.setFrom(fromEmail); // 전송하는 사람의 메일
            helper.setTo(toEmail); // 받는 사람의 메일
            helper.setSubject(subject); // 메일 제목

            message.setText(content, "utf-8", "html"); // 메일 내용

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

        javaMailSender.send(message);
        return true;
    }

    public Boolean sendTestMail(ReqSendMailDto dto) {

        StringBuilder htmlContent = new StringBuilder();
        htmlContent.append("<div style='display:flex; justify-content:center; align-items:center; flex-direction:column; width:400px;'>");
        htmlContent.append(dto.getContent()); // 프론트에서 받아오는 dto값 중 content !
        htmlContent.append("<a href='http://localhost:3000'>메인 화면으로 이동</a>");
        htmlContent.append("</div>");

        return send(dto.getToEmail(), fromEmail, dto.getSubject(), htmlContent.toString());
    }

    public Boolean sendAuthEmail(String toEmail, String username) {
        StringBuilder htmlContent = new StringBuilder();
        htmlContent.append("<div style='display:flex; justify-content:center; align-items:center; flex-direction:column; width:400px;'>");
        htmlContent.append("<h2>회원가입을 완료하시려면 아래의 인증하기 버튼을 클릭하세요</h2>");
        htmlContent.append("<a target='_blank' href='http://localhost:8080/auth/mail?token=");
        htmlContent.append(jwtProvider.generateEmailValidToken(username));
        htmlContent.append("'>인증하기</a>");
        htmlContent.append("</div>");

        return send(toEmail, fromEmail, "우리 사이트의 가입을 위한 인증메일입니다.", htmlContent.toString());
    }

    public String validToken(String token) {
        try {
            Claims claims = jwtProvider.getClaims(token);
            String username = claims.get("username").toString();
            User user = userMapper.findByUsername(username);
            System.out.println(user);

            if(user == null) { // 토큰 5분 만료
                return "notFoundUser";
            }
            if(user.getEmailValid() == 1) { // 이미 email 인증이 된 경우
                return "verified";
            }
            userMapper.modifyEmailValidByUsername(username);
        } catch (Exception e) {
            return "validTokenFail";
        }
        return "success";
    }
}
