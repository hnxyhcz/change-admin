package io.example.core.advice;

import io.example.core.constant.ResponseStatus;
import io.example.core.entity.ResponseResult;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.lang.reflect.Type;

/**
 * @author huang.cz
 * @since 2022/4/15 23:00
 */
@RestControllerAdvice
public class GlobalResponseBodyAdvice implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        Type parameterType = returnType.getGenericParameterType();
        // 资源类型
        if (parameterType.equals(Resource.class)) {
            return false;
        }
        // true -> 进入到 beforeBodyWrite 方法
        return !parameterType.equals(ResponseResult.class);
    }

    /**
     * 返回结果统一处理
     *
     * @param body       结果
     * @param returnType 返回类型
     * @formatter:off
     */
    @Override
    public Object beforeBodyWrite(
            Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response
    ) {
        if (body instanceof ResponseResult) {
            return body;
        }
        return new ResponseResult<>(ResponseStatus.SUCCEED.code, body);
    }
}
