package io.example.data.domain.model;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 系统信息
 *
 * @TableName t_sys_info
 */
@TableName(value = "t_sys_info")
@Data
public class SysInfo implements Serializable {
    /**
     * 主键
     */
    @TableId(value = "id")
    private String id;

    /**
     * 系统名称
     */
    @TableField(value = "title")
    private String title;

    /**
     * 系统版本号
     */
    @TableField(value = "version")
    private String version;

    /**
     * 系统描述信息
     */
    @TableField(value = "description")
    private String description;

    /**
     * 图标
     */
    @TableField(value = "logo")
    private String logo;

    /**
     * 图标
     */
    @TableField(value = "bacg_image")
    private String bacgImage;

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