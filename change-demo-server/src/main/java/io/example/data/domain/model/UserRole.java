package io.example.data.domain.model;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

/**
 * 用户角色关联
 *
 * @TableName t_user_role
 */
@TableName(value = "t_user_role")
@Data
public class UserRole implements Serializable {
    /**
     * ID
     */
    @TableId(value = "id")
    private String id;

    /**
     * 用户ID
     */
    @TableField(value = "user_id")
    private String userId;

    /**
     * 角色ID
     */
    @TableField(value = "role_id")
    private String roleId;

    /**
     * 创建时间
     */
    @TableField(value = "create_at", fill = FieldFill.INSERT)
    private Date createAt;

    /**
     *
     */
    @TableField(value = "create_by", fill = FieldFill.INSERT)
    private String createBy;

    /**
     * 更新时间
     */
    @TableField(value = "update_at", fill = FieldFill.UPDATE)
    private Date updateAt;

    /**
     *
     */
    @TableField(value = "update_by", fill = FieldFill.UPDATE)
    private String updateBy;

    @Serial
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
