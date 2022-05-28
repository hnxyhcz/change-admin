package io.example.core.entity;

import io.example.core.constant.ResponseStatus;
import io.example.core.utils.JsonUtils;
import lombok.Data;

/**
 * @author huang.cz
 * @since 2022/4/15 23:07
 */
@Data
public class ResponseResult<T> {
    private int code;

    private String message;

    private T data;

    public ResponseResult() {
    }

    public ResponseResult(int code, T data) {
        this.code = code;
        this.data = data;
    }

    public ResponseResult(int code, String message) {
        this.code = code;
        this.message = message;
    }

    /**
     * 创建带有返回数据的成功对象。
     *
     * @param data 返回的数据对象
     * @return 返回创建的ResponseResult实例对象
     */
    public static <T> ResponseResult<T> success(T data) {
        return new ResponseResult<>(ResponseStatus.SUCCEED.code, data);
    }

    /**
     * 创建错误对象。
     *
     * @param errorCode 错误码
     * @param message   错误信息
     * @return 返回创建的ResponseResult实例对象
     */
    public static <T> ResponseResult<T> error(ResponseStatus errorCode, String message) {
        return new ResponseResult<>(errorCode.code, message);
    }

    @Override
    public String toString() {
        return JsonUtils.objectToJson(this);
    }
}
