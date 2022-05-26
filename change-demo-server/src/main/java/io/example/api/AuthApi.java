package io.example.api;

import com.anji.captcha.model.common.ResponseModel;
import com.anji.captcha.model.vo.CaptchaVO;
import com.anji.captcha.service.CaptchaService;
import io.example.annotation.ApiOperation;
import io.example.domain.dto.AuthRequest;
import io.example.domain.dto.CreateUserRequest;
import io.example.domain.dto.UserView;
import io.example.domain.response.ResponseCode;
import io.example.domain.response.ResponseResult;
import io.example.service.UserService;
import io.example.utils.JwtTokenUtil;
import io.example.utils.SecurityContextUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * @author huang.cz
 * @since 2022/4/16 23:10
 */
@Tag(name = "Authentication")
@RestController
@RequiredArgsConstructor
public class AuthApi {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserService userService;
    private final CaptchaService captchaService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("api/public/login")
    @ApiOperation(summary = "用户名密码登录", anonymous = true, group = "认证")
    public ResponseEntity<ResponseResult<String>> login(@RequestBody @Valid AuthRequest request) {
        try {
            // 验证码校验
            CaptchaVO captchaVO = new CaptchaVO();
            captchaVO.setCaptchaVerification(request.captcha());
            ResponseModel response = captchaService.verification(captchaVO);
            // 验证码校验失败
            if (!response.isSuccess()) {
                String errorMessage = String.format("验证码错误，错误信息 [%s]", response.getRepMsg());
                return ResponseEntity.ok().body(ResponseResult.error(ResponseCode.FAIL, errorMessage));
            }
            // 认证
            Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));
            // 生成token
            String token = jwtTokenUtil.createAccessToken(authentication);
            return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, token).body(ResponseResult.success(token));
        }
        catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping(value = "api/public/register")
    @ApiOperation(summary = "用户注册", anonymous = true, group = "认证")
    public UserView register(@RequestBody @Valid CreateUserRequest request) {
        return userService.create(request);
    }

    @GetMapping("api/currentUser")
    @ApiOperation(summary = "获取当前用户信息", group = "个人信息")
    public UserView currentUser() {
        return SecurityContextUtil.getCurrentUser();
    }
}
