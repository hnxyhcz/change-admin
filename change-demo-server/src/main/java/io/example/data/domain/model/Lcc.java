package io.example.data.domain.model;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.*;

import lombok.Data;

/**
 * 单位
 * @TableName t_lcc
 */
@TableName(value = "t_lcc")
@Data
public class Lcc implements Serializable {
    /**
     * 单位编码
     */
    @TableId(value = "lcc_code")
    private String lccCode;

    /**
     * 单位编码
     */
    @TableField(value = "lcc_name")
    private String lccName;

    /**
     * 所属区域
     */
    @TableField(value = "area_code")
    private String areaCode;

    /**
     * 省份
     */
    @TableField(value = "province_code")
    private String provinceCode;

    /**
     * 市
     */
    @TableField(value = "city_code")
    private String cityCode;

    /**
     * 区/县
     */
    @TableField(value = "county_code")
    private String countyCode;

    /**
     * 科室
     */
    @TableField(value = "dept_name")
    private String deptName;

    /**
     * 课题负责人1
     */
    @TableField(value = "lcc_leader1")
    private String lccLeader1;

    /**
     * 课题负责人2
     */
    @TableField(value = "lcc_leader2")
    private String lccLeader2;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT, value = "create_at")
    private Date createAt;

    /**
     *
     */
    @TableField(fill = FieldFill.INSERT, value = "create_by")
    private String createBy;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.UPDATE, value = "update_at")
    private Date updateAt;

    /**
     *
     */
    @TableField(fill = FieldFill.UPDATE, value = "update_by")
    private String updateBy;

    @Serial
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
