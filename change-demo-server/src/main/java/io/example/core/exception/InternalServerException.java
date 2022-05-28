package io.example.core.exception;

import io.example.core.constant.ErrorCodeEnum;
import io.example.core.constant.ValueEnum;
import lombok.Getter;
import lombok.NonNull;

/**
 * @author huang.cz
 * @since 2022/5/28 15:59
 */
public class InternalServerException extends RuntimeException {
    @Getter
    private ErrorCodeEnum status;
    @Getter
    private String data;

    public InternalServerException() {
    }

    public InternalServerException(@NonNull ErrorCodeEnum status) {
        super(status.getMessage());
        this.status = status;
        this.data = status.getMessage();
    }

    public InternalServerException(@NonNull ErrorCodeEnum status, String message) {
        super(message);
        this.status = status;
        this.data = message;
    }

    public InternalServerException(@NonNull Integer code, String message) {
        super(message);
        this.status = ValueEnum.valueToEnum(ErrorCodeEnum.class, code);
        this.data = message;
    }

    public InternalServerException(@NonNull ErrorCodeEnum status, Throwable cause) {
        super(status.getMessage(), cause);
        this.status = status;
        this.data = status.getMessage();
    }

    public InternalServerException(@NonNull ErrorCodeEnum status, String message, Throwable cause) {
        super(message, cause);
        this.status = status;
        this.data = message;
    }

    public InternalServerException(@NonNull Integer code, String message, Throwable cause) {
        super(message, cause);
        this.status = ValueEnum.valueToEnum(ErrorCodeEnum.class, code);
        this.data = message;
    }
}
