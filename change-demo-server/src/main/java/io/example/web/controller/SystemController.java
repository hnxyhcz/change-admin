package io.example.web.controller;

import io.example.core.entity.PaginationResponse;
import io.example.data.domain.dto.*;
import io.example.data.domain.model.SysInfo;
import io.example.web.service.SystemService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author huang.cz
 * @since 2022/6/1 23:36
 */
@Tag(name = "系统设置")
@RestController
@RequestMapping("api/system")
@RequiredArgsConstructor
public class SystemController {
    private final SystemService systemService;

    @GetMapping("setting")
    public SystemInfo getSystemInfo() {
        return systemService.getSystemInfo();
    }

    @PostMapping("setting")
    @PreAuthorize("hasRole('admin')")
    public void updateSystemInfo(@RequestBody SysInfo request) {
        systemService.updateSystemInfo(request);
    }

    @RequestMapping("role")
    @PreAuthorize("hasAuthority('system:role:list')")
    public PaginationResponse<RoleView> roles(RoleQuery query) {
        return systemService.getRoles(query);
    }

    @PostMapping("role")
    @PreAuthorize("hasAuthority('system:role:create')")
    public void createRole(@RequestBody RoleRequest request) {
        systemService.createRole(request);
    }

    @PatchMapping("role/{id}")
    @PreAuthorize("hasAuthority('system:role:update')")
    public void updateRole(@PathVariable("id") String id, @RequestBody RoleRequest request) {
        request.setId(id);
        systemService.updateRole(request);
    }

    @DeleteMapping("role/{id}")
    @PreAuthorize("hasAuthority('system:role:delete')")
    public void deleteRole(@PathVariable("id") String id) {
        systemService.deleteRole(id);
    }

    @RequestMapping("permission")
    public List<PermissionView> permissions() {
        return systemService.getPermissions();
    }

    /**
     * 比对数据库和代码里面配置的权限
     */
    @GetMapping("permission/diff")
    @PreAuthorize("hasRole('admin')")
    public void extractCodeDiffDbPermissions() {
        systemService.extractCodeDiffDbPermissions();
    }

}
