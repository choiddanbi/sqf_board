package com.study.SpringSecurityMybatis.aspect;

import com.study.SpringSecurityMybatis.dto.request.ReqOAuth2SubmitDto;
import com.study.SpringSecurityMybatis.dto.request.ReqSignupDto;
import com.study.SpringSecurityMybatis.exception.ValidException;
import com.study.SpringSecurityMybatis.service.UserService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

@Aspect
@Component
public class ValidAspect {

    @Autowired
    private UserService userService;

    @Pointcut("@annotation(com.study.SpringSecurityMybatis.aspect.annotation.ValidAop)")
    private void pointCut() {}

    @Around("pointCut()")
    public Object around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        Object[] args = proceedingJoinPoint.getArgs();
        BindingResult bindingResult = null;

        for(Object arg : args) {
            if(arg.getClass() == BeanPropertyBindingResult.class) {
                bindingResult = (BeanPropertyBindingResult) arg;
            }
        }

        switch (proceedingJoinPoint.getSignature().getName()) {
            case "signup":
                validSignupDto(args, bindingResult);
                break;

            case "oAuth2Submit":
                validOAuth2SignupDto(args, bindingResult);
                break;
        }

        // ValidException 클래스의 생성자로 ValidException 객체 생성
        if(bindingResult.hasErrors()) {
            throw new ValidException("유효성 검사 오류", bindingResult.getFieldErrors());
        }

        return proceedingJoinPoint.proceed();
    }

    private void validSignupDto(Object[] args, BindingResult bindingResult) {
        for(Object arg : args) {
            if(arg.getClass() == ReqSignupDto.class) {
                ReqSignupDto dto = (ReqSignupDto) arg;

                if(!dto.getPassword().equals(dto.getCheckPassword())) {
                    FieldError fieldError
                            = new FieldError("checkPassword", "checkPassword", "비밀번호가 일치하지 않습니다.");
                    bindingResult.addError(fieldError);
                }

                if(userService.isDuplicateUsername(dto.getUsername())) {
                    FieldError fieldError
                            = new FieldError("username", "username", "이미 존재하는 사용자이름입니다.");
                    bindingResult.addError(fieldError);
                }
            }
        }
    }


    private void validOAuth2SignupDto(Object[] args, BindingResult bindingResult) {
        for(Object arg : args) {
            if(arg.getClass() == ReqOAuth2SubmitDto.class) {
                ReqOAuth2SubmitDto dto = (ReqOAuth2SubmitDto) arg;

                if(!dto.getPassword().equals(dto.getCheckPassword())) {
                    FieldError fieldError
                            = new FieldError("checkPassword", "checkPassword", "비밀번호가 일치하지 않습니다.");
                    bindingResult.addError(fieldError);
                }

                if(userService.isDuplicateUsername(dto.getUsername())) {
                    FieldError fieldError
                            = new FieldError("username", "username", "이미 존재하는 사용자이름입니다.");
                    bindingResult.addError(fieldError);
                }
            }
        }
    }

}
