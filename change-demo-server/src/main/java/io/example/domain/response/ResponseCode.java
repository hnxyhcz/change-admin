package io.example.domain.response;

/**
 * @author huang.cz
 * @since 2022/4/15 23:21
 */
public enum ResponseCode {

    /**
     * 结果状态
     */
    SUCCESS(200), FAIL(400), UNAUTHORIZED(401), NOT_FOUND(404), INTERNAL_SERVER_ERROR(500);

    public int code;

    ResponseCode(int code) {
        this.code = code;
    }

}
