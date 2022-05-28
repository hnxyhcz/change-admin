package io.example.core.mybatis;

import java.util.Date;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import io.example.core.constant.AppConsts;
import lombok.Data;

/**
 * model 基础父类
 *
 * @author javahuang
 * @date 2021/10/10
 */
@Data
public class BaseModel {

	@TableId(type = IdType.ASSIGN_ID)
	private String id;

	@TableField(fill = FieldFill.INSERT)
	private Date createAt;

	@TableField(fill = FieldFill.INSERT, select = false)
	private String createBy;

	@TableField(fill = FieldFill.UPDATE, select = false)
	private Date updateAt;

	@TableField(fill = FieldFill.UPDATE, select = false)
	private String updateBy;

	/**
	 * 默认逻辑删除标记，is_deleted=0有效
	 */
	@TableLogic
	@JsonIgnore
	@TableField(value = AppConsts.COLUMN_IS_DELETED, select = false)
	private boolean deleted = false;

}
