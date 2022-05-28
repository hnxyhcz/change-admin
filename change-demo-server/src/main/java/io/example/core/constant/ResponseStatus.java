package io.example.core.constant;

import lombok.NonNull;

/**
 * @author huang.cz
 * @since 2022/4/15 23:21
 */
public enum ResponseStatus implements ValueEnum<Integer> {

    /**
     * 结果状态
     */
    SUCCEED(200),

    FAILED(400),

    UNAUTHORIZED(401),

    FORBIDDEN(403),

    NOT_FOUND(404),

    SERVER_ERROR(500),
    ;

    public final int code;

    ResponseStatus(@NonNull Integer code) {
        this.code = code;
    }

    @Override
    public Integer getValue() {
        return this.code;
    }
}
