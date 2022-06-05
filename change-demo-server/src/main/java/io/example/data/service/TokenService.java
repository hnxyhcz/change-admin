package io.example.data.service;

import io.example.data.domain.dto.TokenUser;

import javax.servlet.http.HttpServletRequest;

/**
 * @author huang.cz
 * @since 2022/5/27 15:15
 */
public interface TokenService {

    /**
     * 获取当前登录用户
     *
     * @param request 请求
     * @return 当前请求登录用户
     */
    TokenUser getTokenUser(HttpServletRequest request);

    /**
     * 创建accessToken
     *
     * @return token
     */
    String createAccessToken();

    /**
     * 刷新AccessToken令牌
     *
     * @param user 登录用户
     */
    void refreshAccessToken(TokenUser user);

    /**
     * 验证令牌有效期，相差不足20分钟，自动刷新缓存
     *
     * @param request 请求
     */
    void verifyAccessToken(HttpServletRequest request);

    /**
     * 删除用户信息
     *
     * @param request 请求
     */
    void delTokenUser(HttpServletRequest request);


    /**
     * 删除accessToken并删除用户信息
     *
     * @param accessToken token令牌
     */
    void deleteAccessToken(String accessToken);

}
