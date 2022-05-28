package io.example.data.domain.dto;

import java.util.Date;
import java.util.List;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;

import io.example.core.annotation.RelationGlobalDict;
import io.example.core.constant.DictCodeEnum;
import lombok.Data;

/**
 * @author javahuang
 * @date 2022/5/16
 */
@Data
public class LccView {

    /**
     * 单位编码
     */
    @ExcelProperty("单位编码")
    private String lccCode;

    /**
     * 单位名称
     */
    @ExcelProperty("单位名称")
    private String lccName;

    /**
     * 所属区域
     */
    @ExcelIgnore
    private String areaCode;

    @RelationGlobalDict(masterIdField = "areaCode", dictCode = DictCodeEnum.areaCode)
    @ExcelProperty("所属区域")
    private String areaName;

    /**
     * 省份
     */
    @ExcelIgnore
    private String provinceCode;

    @RelationGlobalDict(masterIdField = "provinceCode", dictCode = DictCodeEnum.distinct)
    @ExcelProperty("省份")
    private String provinceName;

    /**
     * 市
     */
    @ExcelIgnore
    private String cityCode;

    @RelationGlobalDict(masterIdField = "cityCode", dictCode = DictCodeEnum.distinct)
    @ExcelProperty("市")
    private String cityName;

    /**
     * 区/县
     */
    private String countyCode;

    @ExcelProperty("区/县")
    @RelationGlobalDict(masterIdField = "countyCode", dictCode = DictCodeEnum.distinct)
    private String countyName;

    /**
     * 科室
     */
    @ExcelProperty("科室")
    private String deptName;

    /**
     * 课题负责人1
     */
    @ExcelProperty("课题负责人1")
    private String lccLeader1;

    /**
     * 课题负责人2
     */
    @ExcelProperty("课题负责人2")
    private String lccLeader2;

    /**
     * 省市县
     */
    @ExcelIgnore
    private List<String> distinct;

    @ExcelIgnore
    private Date createAt;

}
