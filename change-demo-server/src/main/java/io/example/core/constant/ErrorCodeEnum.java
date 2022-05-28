package io.example.core.constant;

/**
 * @author huang.cz
 * @since 2022/5/28 16:09
 */
public enum ErrorCodeEnum implements ValueEnum<Integer> {
    /**
     * 账号或者密码错误
     */
    USERNAME_PASSWORD_ERROR(1024, "账号或者密码错误"),
    /**
     * 账号已存在
     */
    USERNAME_EXISTS(1025, "账号已存在"),
    /**
     * 密码验证失败
     */
    VALIDATION_ERROR(1026, "密码验证失败"),
    /**
     * 小程序 code 不存在
     */
    OPENID_NOT_EXIST(1027, "code不存在"),
    /**
     * 页面不存在
     */
    PAGE_NOT_FOUND(4004, "对不起，您访问的页面不存在"),

    ;

    private Integer code;
    private String message;

    ErrorCodeEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public Integer getValue() {
        return this.code;
    }
}

