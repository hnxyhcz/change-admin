package io.example.web.api;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author huang.cz
 * @since 2022/4/16 23:10
 */
@Tag(name = "User")
@RestController
@RequestMapping(path = "api/user")
@RequiredArgsConstructor
public class UserApi {

    /**
     * PreAuthorize根据SPEL表达式判断权限（这里表示只能删除自己）
     *
     * @param username
     * @return
     */
    @DeleteMapping("username")
    @PreAuthorize("authentication.name.equals(#username)")
    public void deleteByUsername(String username) {
        // TODO 根据用户名删除
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        System.out.println(currentPrincipalName);
    }

}
