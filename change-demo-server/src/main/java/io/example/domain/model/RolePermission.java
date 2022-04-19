package io.example.domain.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @author huang.cz
 * @since 2022/4/10 15:45
 */
@Getter
@Setter
public class RolePermission {
    /**
     * 角色
     */
    private String authority;

    /**
     * 菜单权限
     */
    private List<String> menus;
    /**
     * 数据权限
     */
    private List<String> permissions;
}
