package io.example.data.domain.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * @author huang.cz
 * @since 2022/6/5 16:19
 */
@Data
@NoArgsConstructor
public class TokenUser implements Serializable {
    /**
     * 用户 ID
     */
    private String userId;
    /**
     * 用户 token
     */
    private String token;
    /**
     * 用户登录时间
     */
    private Date loginTime;
    /**
     * 用户过期时间
     */
    private Date expireTime;
    /**
     * 登录IP地址
     */
    private String ipaddr;
    /**
     * 浏览器类型
     */
    private String browser;
    /**
     * 操作系统
     */
    private String os;

    public TokenUser(String userId, String token) {
        this.userId = userId;
        this.token = token;
    }
}
