package io.example.data.domain.dto;

import java.util.Date;
import java.util.List;

import io.example.core.annotation.RelationGlobalDict;
import io.example.core.constant.DictCodeEnum;
import org.springframework.format.annotation.DateTimeFormat;

import com.alibaba.excel.annotation.ExcelIgnoreUnannotated;
import com.alibaba.excel.annotation.ExcelProperty;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

/**
 * @author javahuang
 * @date 2021/10/15
 */
@Data
@ExcelIgnoreUnannotated
public class UserView {

	private String id;

	@ExcelProperty("协作单位编码")
	private String name;

	private String username;

	@ExcelProperty("座机号")
	private String phone;

	@ExcelProperty("电子邮箱")
	private String email;

	private String avatar;

	private String gender;

	private Boolean status;

	private Date createAt;

	@ExcelProperty("协作单位编码")
	private String lccCode;

	@RelationGlobalDict(masterIdField = "lccCode", dictCode = DictCodeEnum.lcc)
	@ExcelProperty("协作单位名称")
	private String lccName;

	private List<RoleView> roles;

	/**
	 * 患者ID
	 */
	private String patientId;

	/**
	 * 手机号
	 */
	@ExcelProperty("手机号")
	private String mobile;

	/**
	 * 参研状态 1参研 2离研
	 */
	@ExcelProperty("参研状态")
	private String joinResearchStatus;

	/**
	 * 保密声明 1已签署 0未签署
	 */
	@ExcelProperty("保密声明")
	private String secretState;

	/**
	 * 电子签名表 1已签署 2未签署 3不适用
	 */
	@ExcelProperty("电子签名表")
	private String signatureForm;

	/**
	 * 科研证明 1已发 0未发
	 */
	@ExcelProperty("科研证明")
	private String researchCertificate;

	/**
	 * 参研日期
	 */
	@JsonFormat(locale="zh", timezone="GMT+8", pattern="yyyy-MM-dd")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@ExcelProperty("参研日期")
	private Date joinResearchDate;

	/**
	 * 离研日期
	 */
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@JsonFormat(locale="zh", timezone="GMT+8", pattern="yyyy-MM-dd")
	@ExcelProperty("离研日期")
	private Date leaveResearchDate;

}
