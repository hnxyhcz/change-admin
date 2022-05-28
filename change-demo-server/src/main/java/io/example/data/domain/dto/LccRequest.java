package io.example.data.domain.dto;

import java.util.List;

import javax.validation.constraints.NotBlank;

import lombok.Data;

/**
 * @author javahuang
 * @date 2022/5/16
 */
@Data
public class LccRequest {


    /**
     * 单位编码
     */
    private String lccCode;

    /**
     * 单位编码
     */
    private String lccName;

    /**
     * 所属区域
     */
    @NotBlank
    private String areaCode;

    /**
     * 省份
     */
    @NotBlank
    private String provinceCode;

    /**
     * 市
     */
    private String cityCode;

    /**
     * 区/县
     */
    private String countyCode;

    /**
     * 科室
     */
    private String deptName;

    /**
     * 课题负责人1
     */
    private String lccLeader1;

    /**
     * 课题负责人2
     */
    private String lccLeader2;

    /**
     * 省市县
     */
    private List<String> distinct;

}
