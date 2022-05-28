package io.example.data.domain.model;


import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import io.example.core.mybatis.BaseModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 单位人员
 *
 * @TableName t_user
 */
@TableName(value = "t_user")
@Data
@EqualsAndHashCode(callSuper = false)
public class User extends BaseModel implements Serializable {

    /**
     * 用户类型 0管理员 1小程序 2NCC 3LCC
     */
    @TableField(value = "user_type")
    private Integer userType;

    /**
     * 单位编码
     */
    @TableField(value = "lcc_code")
    private String lccCode;

    /**
     * 姓名
     */
    @TableField(value = "name")
    private String name;

    /**
     * 性别
     */
    @TableField(value = "gender")
    private String gender;

    /**
     * 手机号
     */
    @TableField(value = "mobile")
    private String mobile;

    /**
     * 座机号
     */
    @TableField(value = "phone")
    private String phone;

    /**
     * 电子邮箱
     */
    @TableField(value = "email")
    private String email;

    /**
     * 头像地址
     */
    @TableField(value = "avatar")
    private String avatar;

    /**
     * 激活状态 1已激活 0失活
     */
    @TableField(value = "status")
    private Boolean status;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
