package io.example.data.domain.dto;

import io.example.core.constant.AppConsts;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author huang.cz
 * @since 2022/5/26 11:40
 */
@Data
public class AuthRequest {
    @NotNull
    private String username;

    @NotNull
    private String password;

    @NotNull
    private String captcha;

    private Boolean autoLogin;

    /**
     * 默认认证方式，密码认证
     */
    private AppConsts.AUTH_TYPE authType = AppConsts.AUTH_TYPE.PWD;
}
