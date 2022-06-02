package io.example.data.domain.model;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 角色
 *
 * @TableName t_role
 */
@TableName(value = "t_role")
@Data
public class Role implements Serializable {
    /**
     * ID
     */
    @TableId(value = "id")
    private String id;

    /**
     * 名称
     */
    @TableField(value = "name")
    private String name;

    /**
     * 编码
     */
    @TableField(value = "code")
    private String code;

    /**
     * 备注
     */
    @TableField(value = "remark")
    private String remark;

    /**
     * 权限列表
     */
    @TableField(value = "authority")
    private String authority;

    /**
     * 是否删除
     */
    @TableField(value = "is_deleted")
    private Boolean isDeleted;

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

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
