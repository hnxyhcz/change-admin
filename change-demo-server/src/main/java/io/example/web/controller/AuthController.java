package io.example.web.controller;

import com.anji.captcha.model.common.ResponseModel;
import com.anji.captcha.model.vo.CaptchaVO;
import com.anji.captcha.service.CaptchaService;
import io.example.core.constant.AppConsts;
import io.example.core.constant.ErrorCodeEnum;
import io.example.core.constant.ResponseStatus;
import io.example.core.entity.ResponseResult;
import io.example.core.exception.InternalServerException;
import io.example.core.utils.IPUtils;
import io.example.data.domain.dto.AuthRequest;
import io.example.data.domain.dto.CurrentUser;
import io.example.data.domain.dto.UserRequest;
import io.example.data.service.UserService;
import io.example.data.service.impl.RedisTokenServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

/**
 * @author huang.cz
 * @since 2022/4/16 23:10
 */
@Tag(name = "登录")
@RestController
@RequiredArgsConstructor
@RequestMapping("api")
public class AuthController {

    private final RedisTokenServiceImpl tokenService;
    private final UserService userService;
    private final CaptchaService captchaService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("public/login")
    public ResponseEntity<ResponseResult<String>> login(@RequestBody @Valid AuthRequest request) {
        // 验证码校验
        CaptchaVO captchaVO = new CaptchaVO();
        captchaVO.setCaptchaVerification(request.getCaptcha());
        ResponseModel response = captchaService.verification(captchaVO);
        if (!response.isSuccess()) {
            String errorMessage = String.format("验证码错误，错误信息 [%s]", response.getRepMsg());
            return ResponseEntity.ok().body(ResponseResult.error(ResponseStatus.FAILED, errorMessage));
        }
        // 认证方式
        Authentication authentication;
        if (request.getAuthType() == AppConsts.AUTH_TYPE.PWD) {
            authentication = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        } else {
            throw new AccessDeniedException("不支持的认证方式");
        }
        // 认证
        Authentication authenticate;
        try {
            authenticate = authenticationManager.authenticate(authentication);
        } catch (Exception ex) {
            throw new InternalServerException(ErrorCodeEnum.USERNAME_PASSWORD_ERROR, ex);
        }
        // 生成token
        CurrentUser currentUser = (CurrentUser) authenticate.getPrincipal();
        String token = tokenService.createAccessToken(currentUser);
        return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, token).body(ResponseResult.success(token));
    }

    /**
     * 注册用户
     */
    @PostMapping(value = "public/register")
    public void register(@RequestBody @Valid UserRequest request) {
        userService.createUser(request);
    }

    @GetMapping("public/checkUsername")
    public boolean checkUsernameExist(String username) {
        return userService.checkUsernameExist(username);
    }

    @PostMapping({"captcha/get"})
    public ResponseModel get(@RequestBody CaptchaVO data, HttpServletRequest request) {
        assert request.getRemoteHost() != null;
        data.setBrowserInfo(IPUtils.getRemoteId(request));
        return this.captchaService.get(data);
    }

    @PostMapping({"captcha/check"})
    public ResponseModel check(@RequestBody CaptchaVO data, HttpServletRequest request) {
        data.setBrowserInfo(IPUtils.getRemoteId(request));
        return this.captchaService.check(data);
    }

}
