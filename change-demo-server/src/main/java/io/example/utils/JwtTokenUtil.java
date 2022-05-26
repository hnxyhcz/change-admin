package io.example.utils;

import io.example.domain.dto.UserView;
import io.example.domain.mapper.UserViewMapper;
import io.example.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;

import static java.util.stream.Collectors.joining;

/**
 * @author huang.cz
 * @since 2022/4/16 23:10
 */
@Component
@RequiredArgsConstructor
public class JwtTokenUtil {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    private final UserViewMapper userViewMapper;

    /**
     * 生成token
     *
     * @param authentication 认证成功后的用户信息
     * @return token字符串
     * @formatter:off
     */
    public String createAccessToken(Authentication authentication) {
        User user = (User)authentication.getPrincipal();
        UserView userView = userViewMapper.toUserView(user);

        Instant now = Instant.now();
        long expiry = 36000L;
        String scope = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("example.io")
            .issuedAt(now)
            .expiresAt(now.plusSeconds(expiry))
            .subject(userView.getId())
            .claim("roles", scope)
            .claim("user", userView)
            .build();

        return this.jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    /**
     * 获取用户账号
     */
    public String getUsername(String token) {
        UserView userView = getCurrentUser(token);
        return userView.getUsername();
    }

    /**
     * 获取当前用户
     */
    public UserView getCurrentUser(String token) {
        Map<String, Object> claims = jwtDecoder.decode(token).getClaims();
        return (UserView)claims.get("user");
    }
    public Jwt test(String token) {
        return jwtDecoder.decode(token);
    }

    /**
     * 获取token失效时间
     */
    public Instant getExpirationDate(String token) {
        return jwtDecoder.decode(token).getExpiresAt();
    }

}
