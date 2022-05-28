package io.example.core.exception;

import io.example.core.constant.ErrorCodeEnum;
import io.example.core.constant.ResponseStatus;
import io.example.core.entity.ResponseResult;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ValidationException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author huang.cz
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private final Logger logger = LogManager.getLogger();

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ResponseResult<String>> handleNotFoundException(HttpServletRequest request,
                                                                          NotFoundException ex) {
        logger.error("NotFoundException {}\n", request.getRequestURI(), ex);

        return ResponseEntity.ok().body(ResponseResult.error(ResponseStatus.FAILED, "Not found exception"));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ResponseResult<String>> handleValidationException(HttpServletRequest request,
                                                                            ValidationException ex) {
        logger.error("ValidationException {}\n", request.getRequestURI(), ex);

        return ResponseEntity.ok().body(ResponseResult.error(ResponseStatus.FAILED, "Validation exception"));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ResponseResult<String>> handleMissingServletRequestParameterException(
            HttpServletRequest request, MissingServletRequestParameterException ex) {
        logger.error("handleMissingServletRequestParameterException {}\n", request.getRequestURI(), ex);

        return ResponseEntity.ok().body(ResponseResult.error(ResponseStatus.FAILED, "Missing request parameter"));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ResponseResult<Map<String, String>>>
    handleMethodArgumentTypeMismatchException(HttpServletRequest request, MethodArgumentTypeMismatchException ex) {
        logger.error("handleMethodArgumentTypeMismatchException {}\n", request.getRequestURI(), ex);

        Map<String, String> details = new HashMap<>(1);
        details.put(ex.getName(), ex.getMessage());

        ResponseResult<Map<String, String>> response =
                ResponseResult.error(ResponseStatus.FAILED, "Missing request parameter");
        response.setData(details);
        return ResponseEntity.ok().body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseResult<Map<String, String>>>
    handleMethodArgumentNotValidException(HttpServletRequest request, MethodArgumentNotValidException ex) {
        logger.error("handleMethodArgumentNotValidException {}\n", request.getRequestURI(), ex);

        Map<String, String> details = new HashMap<>(ex.getBindingResult().getFieldErrors().size());
        ex.getBindingResult().getFieldErrors()
                .forEach(fieldError -> details.put(fieldError.getField(), fieldError.getDefaultMessage()));

        ResponseResult<Map<String, String>> response = ResponseResult.error(ResponseStatus.FAILED, "参数校验失败");
        response.setData(details);
        return ResponseEntity.ok().body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ResponseResult<String>> handleAccessDeniedException(HttpServletRequest request,
                                                                              AccessDeniedException ex) {
        logger.error("handleAccessDeniedException {}\n", request.getRequestURI(), ex);

        return ResponseEntity.ok().body(ResponseResult.error(ResponseStatus.FORBIDDEN, ex.getMessage()));
    }

    @ExceptionHandler(InternalServerException.class)
    public ResponseEntity<ResponseResult<String>> handleInternalServerException(HttpServletRequest request, InternalServerException ex) {
        ErrorCodeEnum errorCode = ex.getStatus();
        logger.error("handleResponseException {} errorCode={}, errorMessage={}",
                request.getRequestURI(), errorCode.getCode(), errorCode.getMessage().getBytes(), ex);

        return ResponseEntity.ok().body(new ResponseResult<>(errorCode.getCode(), errorCode.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseResult<String>> handleException(HttpServletRequest request, Exception ex) {
        logger.error("handleInternalServerError {}\n", request.getRequestURI(), ex);

        return ResponseEntity.ok().body(ResponseResult.error(ResponseStatus.SERVER_ERROR, ex.getMessage()));
    }
}
