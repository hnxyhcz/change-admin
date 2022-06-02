package io.example.core.security.handler;

import io.example.core.entity.ResponseResult;
import io.example.core.utils.JsonUtils;
import io.example.data.domain.dto.CurrentUser;
import io.example.data.service.impl.RedisTokenServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author huang.cz
 * @since 2022/5/26 23:56
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LogoutSucceedHandler implements LogoutSuccessHandler {
    private final RedisTokenServiceImpl tokenService;

    @SneakyThrows
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        CurrentUser loginUser = tokenService.getCurrentUser(request);
        if (null != loginUser) {
            tokenService.delLoginUser(request);
        }
        ResponseResult<String> result = ResponseResult.success("注销成功");
        response.setStatus(200);
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        response.getWriter().print(JsonUtils.objectToJson(result));
    }
}
