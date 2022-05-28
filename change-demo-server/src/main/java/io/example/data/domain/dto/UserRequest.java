package io.example.data.domain.dto;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

/**
 * @author javahuang
 * @date 2021/10/15
 */
@Data
public class UserRequest {

	private String id;

	private Integer userType;

	private String name;

	private String avatar;

	private String profile;

	/** 登录账号 */
	private String username;

	/** 密码 */
	private String password;

	/** 密码修改原密码 */
	private String oldPassword;

	private List<String> roles;

	private String phone;

	private String email;

	private String gender;

	private Boolean status;

	private String openid;

	/**
	 * 单位编码
	 */
	private String lccCode;

	/**
	 * 患者ID
	 */
	private String patientId;

	/**
	 * 手机号
	 */
	private String mobile;

	/**
	 * 参研状态 1参研 2离研
	 */
	private String joinResearchStatus;

	/**
	 * 保密声明 1已签署 0未签署
	 */
	private String secretState;

	/**
	 * 电子签名表 1已签署 2未签署 3不适用
	 */
	private String signatureForm;

	/**
	 * 科研证明 1已发 0未发
	 */
	private String researchCertificate;

	/**
	 * 参研日期
	 */
	@JsonFormat(locale="zh", timezone="GMT+8", pattern="yyyy-MM-dd")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date joinResearchDate;

	/**
	 * 离研日期
	 */
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@JsonFormat(locale="zh", timezone="GMT+8", pattern="yyyy-MM-dd")
	private Date leaveResearchDate;

}
