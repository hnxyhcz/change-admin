package io.example.core.utils;

import io.example.core.constant.AppConsts;
import io.example.core.security.WebSecurityConfig;
import io.example.data.domain.dto.CurrentUser;
import lombok.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Objects;

/**
 * @author huang.cz
 * @since 2022/4/16 23:36
 */
public class SecurityUtils {

    /**
     * 获取当前登录的用户
     *
     * @return {@link CurrentUser}
     */
    public static CurrentUser getCurrentUser() {
        if (getAuthentication() == null) {
            return new CurrentUser(AppConsts.ANONYMOUS_USER_ID);
        }
        Object principal = getAuthentication().getPrincipal();
        if (principal instanceof CurrentUser) {
            return (CurrentUser) principal;
        }
        return new CurrentUser(AppConsts.ANONYMOUS_USER_ID);
    }

    /**
     * 获取Authentication
     *
     * @return {@link Authentication}
     */
    @Nullable
    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public static String getUserId() {
        return getCurrentUser().getUserId();
    }

    public static String getUsername() {
        return getCurrentUser().getUsername();
    }

    /**
     * 是否拥有管理员权限
     */
    public static boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream().anyMatch(s -> AppConsts.ROLE_ADMIN.equals(s.getAuthority()));
    }

    /**
     * 获取密码加密bean
     *
     * @return {@link PasswordEncoder}
     * @see WebSecurityConfig#passwordEncoder()
     */
    @NonNull
    public static PasswordEncoder getPasswordEncoder() {
        return Objects.requireNonNull(ContextHelper.getBean(PasswordEncoder.class));
    }
}
