package io.example.data.service;

import io.example.data.domain.dto.CurrentUser;

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
    CurrentUser getCurrentUser(HttpServletRequest request);

    /**
     * 创建accessToken
     *
     * @param user 登录用户
     * @return AccessToken
     */
    String createAccessToken(CurrentUser user);

    /**
     * 刷新AccessToken令牌
     *
     * @param user 登录用户
     */
    void refreshAccessToken(CurrentUser user);

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
    void delLoginUser(HttpServletRequest request);


    /**
     * 删除accessToken并删除用户信息
     *
     * @param accessToken token令牌
     */
    void deleteAccessToken(String accessToken);

}
