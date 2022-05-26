package io.example.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 接口Api注解，根据该注解标注的方法，自动获取所有的api
 * @author huang.cz
 * @since 2022/4/11 20:55
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ApiOperation {
    /**
     * 组别（一般用于表示菜单名）
     */
    String group() default "";

    /**
     * 描述
     */
    String summary() default "";

    /**
     * 匿名的请求
     */
    boolean anonymous() default false;
}
