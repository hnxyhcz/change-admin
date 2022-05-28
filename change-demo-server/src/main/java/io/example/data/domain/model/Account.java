package io.example.data.domain.model;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import io.example.core.mybatis.BaseModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 登录账号
 * @author huang.cz
 * @TableName t_account
 */
@TableName(value ="t_account")
@Data
@EqualsAndHashCode(callSuper = false)
public class Account extends BaseModel implements Serializable {

    /**
     * 用户ID
     */
    @TableField(value = "user_id")
    private String userId;

    /**
     * 认证方式
     */
    @TableField(value = "auth_type")
    private String authType;

    /**
     * 用户名
     */
    @TableField(value = "auth_account")
    private String authAccount;

    /**
     * 密码
     */
    @TableField(value = "auth_secret")
    private String authSecret;

    /**
     * 加密盐
     */
    @TableField(value = "secret_salt")
    private String secretSalt;

    /**
     * 最近登录时间
     */
    @TableField(value = "last_login_time")
    private Date lastLoginTime;

    /**
     * 最近一次修改密码时间
     */
    @TableField(value = "last_update_pwd_time")
    private Date lastUpdatePwdTime;

    /**
     * 微信 openid
     */
    @TableField(value = "openid")
    private String openid;

    @TableField(exist = false)
    private boolean deleted = false;

    @Serial
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
