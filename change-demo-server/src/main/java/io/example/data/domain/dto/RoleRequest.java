package io.example.data.domain.dto;

import java.util.List;

import lombok.Data;

/**
 * @author javahuang
 * @date 2021/10/12
 */
@Data
public class RoleRequest {

	private String id;

	private String name;

	private String code;

	private String remark;

	/** 权限编码列表 */
	private List<String> authorities;

}
