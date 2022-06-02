package io.example.web.controller;

import io.example.core.utils.SecurityUtils;
import io.example.data.domain.dto.CurrentUser;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author huang.cz
 * @since 2022/5/28 23:16
 */
@Tag(name = "当前用户")
@RestController
@RequiredArgsConstructor
@RequestMapping("api/current")
public class CurrentController {
    /**
     * 获取当前用户信息
     *
     * @return 用户信息
     */
    @GetMapping("user")
    public CurrentUser currentUser() {
        return SecurityUtils.getCurrentUser();
    }

    /**
     * 通知
     */
    @GetMapping("notices")
    public void notices() {
        System.out.println("通知");
    }
}
