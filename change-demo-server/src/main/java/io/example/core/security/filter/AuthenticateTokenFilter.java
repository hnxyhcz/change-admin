package io.example.core.security.filter;

import io.example.core.utils.SecurityUtils;
import io.example.data.domain.dto.CurrentUser;
import io.example.data.domain.dto.TokenUser;
import io.example.data.service.TokenService;
import io.example.data.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;

/**
 * @author huang.cz
 * @since 2022/5/27 9:21
 */
@Component
@RequiredArgsConstructor
public class AuthenticateTokenFilter extends OncePerRequestFilter {
    private final UserService userService;
    private final TokenService tokenService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        TokenUser tokenUser = tokenService.getTokenUser(request);
        if (!Objects.isNull(tokenUser) && Objects.isNull(SecurityUtils.getAuthentication())) {
            // 获取用户信息，并设置到spring security的上下文中
            CurrentUser currentUser = userService.loadUserById(tokenUser.getUserId());
            UsernamePasswordAuthenticationToken authenticationToken
                    = new UsernamePasswordAuthenticationToken(currentUser, null, currentUser.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            // 刷新 token 的有效时间
            tokenService.verifyAccessToken(request);
        }

        filterChain.doFilter(request, response);
    }
}
