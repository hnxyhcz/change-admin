package io.example.data.service.impl;

import cn.hutool.core.util.IdUtil;
import cn.hutool.extra.servlet.ServletUtil;
import io.example.core.constant.CacheConsts;
import io.example.core.security.TokenProperties;
import io.example.data.domain.dto.CurrentUser;
import io.example.data.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

/**
 * @author huang.cz
 * @since 2022/5/26 22:52
 */
@Service
@RequiredArgsConstructor
public class RedisTokenServiceImpl implements TokenService {
    private final TokenProperties properties;
    private final RedisTemplate<String, CurrentUser> redisTemplate;

    /**
     * 缓存中获取当前用户
     */
    public CurrentUser getCurrentUser(HttpServletRequest request) {
        String accessToken = getAccessToken(request);
        if (StringUtils.hasLength(accessToken)) {
            String tokenKey = getAccessTokenKey(accessToken);
            return redisTemplate.opsForValue().get(tokenKey);
        }
        return null;
    }

    /**
     * 生成token
     */
    public String createAccessToken(@NotNull CurrentUser user) {
        String accessToken = IdUtil.fastUUID();
        user.setToken(accessToken);
        setUserAgent(user);
        refreshAccessToken(user);
        return accessToken;
    }

    /**
     * 刷新token过期时间
     *
     * @param currentUser 登录用户
     */
    public void refreshAccessToken(@NotNull CurrentUser currentUser) {
        long expire = TimeUnit.MILLISECONDS.convert(properties.getExpireTime());
        String userTokenKey = getAccessTokenKey(currentUser.getToken());
        redisTemplate.opsForValue().set(userTokenKey, currentUser, expire, TimeUnit.MILLISECONDS);
    }

    /**
     * 验证token是否过期，自动刷新缓存
     *
     * @param request 请求
     */
    public void verifyAccessToken(HttpServletRequest request) {
        CurrentUser currentUser = getCurrentUser(request);
        if (Objects.nonNull(currentUser)) {
            refreshAccessToken(currentUser);
        }
    }

    /**
     * 删除用户信息
     *
     * @param request 请求
     */
    public void delLoginUser(HttpServletRequest request) {
        String accessToken = getAccessToken(request);
        if (StringUtils.hasLength(accessToken)) {
            deleteAccessToken(accessToken);
        }
    }

    /**
     * 删除accessToken并删除用户信息
     *
     * @param accessToken token令牌
     */
    public void deleteAccessToken(String accessToken) {
        if (StringUtils.hasLength(accessToken)) {
            redisTemplate.delete(getAccessTokenKey(accessToken));
        }
    }

    /**
     * 将AccessToken转换成redis key
     *
     * @param accessToken accessToken
     * @return {@link CacheConsts#TOKEN_CACHE_NAME}::accessToken
     */
    private String getAccessTokenKey(String accessToken) {
        return String.format("%s::%s", CacheConsts.TOKEN_CACHE_NAME, accessToken);
    }

    /**
     * 根据请求获取AccessToken
     *
     * @param request 请求
     * @return AccessToken
     */
    private String getAccessToken(HttpServletRequest request) {
        String token = request.getHeader(this.properties.getHeader());
        // 校验是否满足前缀
        if (StringUtils.hasLength(token) && token.startsWith(this.properties.getPrefix())) {
            token = token.replace(this.properties.getPrefix(), "");
        }
        return token;
    }


    /**
     * 设置用户代理信息
     * <p>TODO 设置登录日志存储的ip等信息</p>
     *
     * @param user 登录信息
     */
    private void setUserAgent(CurrentUser user) {
        RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
        if (null == attributes) {
            return;
        }
        if (attributes instanceof ServletRequestAttributes) {
            HttpServletRequest request = ((ServletRequestAttributes) attributes).getRequest();
            String ip = ServletUtil.getClientIP(request);
        }
    }
}

