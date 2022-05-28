package io.example.core.annotation;

import java.lang.annotation.*;

import io.example.core.constant.DictCodeEnum;

/**
 * 全局常量字典
 *
 * @author javahuang
 * @date 2022/5/16
 */
@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RelationGlobalDict {

    /**
     * 当前对象的关联Id字段名称。
     *
     * @return 当前对象的关联Id字段名称。
     */
    String masterIdField();

    /**
     * 全局字典编码。
     *
     * @return 全局字典编码。空表示为不使用全局字典。
     */
    DictCodeEnum dictCode();
}
