package io.example.utils;

import java.util.Objects;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import com.nimbusds.jose.shaded.json.JSONObject;

import io.example.domain.dto.UserView;

/**
 * @author huang.cz
 * @since 2022/4/16 23:36
 */
public class SecurityContextUtil {

    public static UserView getCurrentUser() {
        return JsonUtil.parseObject(getUserClaim(), UserView.class);
    }

    public static JSONObject getUserClaim() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Jwt) {
            return ((Jwt)principal).getClaim("user");
        }
        return null;
    }

    public static String getUsername() {
        return Objects.requireNonNull(getUserClaim()).get("username").toString();
    }

    public static String getUserId() {
        return Objects.requireNonNull(getUserClaim()).get("id").toString();
    }

}