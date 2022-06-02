package io.example.web.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.example.core.constant.CacheConsts;
import io.example.core.entity.PaginationResponse;
import io.example.core.security.PreAuthorizeAnnotationExtractor;
import io.example.data.domain.dto.*;
import io.example.data.domain.mapper.RoleViewMapper;
import io.example.data.domain.model.Role;
import io.example.data.domain.model.SysInfo;
import io.example.data.domain.model.UserRole;
import io.example.data.mapper.SysInfoMapper;
import io.example.data.mapper.UserRoleMapper;
import io.example.data.service.impl.RoleServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

/**
 * @author huang.cz
 * @since 2022/6/1 23:38
 */
@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class SystemService {

    private final RoleViewMapper roleViewMapper;
    private final CacheManager cacheManager;
    private final UserRoleMapper userRoleMapper;
    private final RoleServiceImpl roleService;

    private final SysInfoMapper sysInfoMapper;

    public SystemInfo getSystemInfo() {
        SystemInfo systemInfo = new SystemInfo();
        SysInfo info = sysInfoMapper.selectOne(Wrappers.lambdaQuery());
        BeanUtils.copyProperties(info, systemInfo);
        return systemInfo;
    }

    public void updateSystemInfo(SysInfo request) {
        sysInfoMapper.updateById(request);
    }

    public PaginationResponse<RoleView> getRoles(RoleQuery query) {
        Page<Role> rolePage = roleService.pageByQuery(query,
                Wrappers.<Role>lambdaQuery().like(isNotBlank(query.getName()), Role::getName, query.getName()));
        return new PaginationResponse<>(rolePage.getTotal(),
                rolePage.getRecords().stream().map(x -> roleViewMapper.toView(x)).collect(Collectors.toList()));
    }

    public void createRole(RoleRequest request) {
        roleService.save(roleViewMapper.fromRequest(request));
    }

    public void updateRole(RoleRequest request) {
        roleService.updateById(roleViewMapper.fromRequest(request));
        evictCache(request.getId());
    }

    public void deleteRole(String id) {
        roleService.removeById(id);
        userRoleMapper.delete(Wrappers.<UserRole>lambdaQuery().eq(UserRole::getRoleId, id));
        evictCache(id);
    }

    /**
     * 角色信息变化时，清除对应的 cache 缓存
     *
     * @param roleId
     */
    private void evictCache(String roleId) {
        userRoleMapper.selectList(Wrappers.<UserRole>lambdaQuery().eq(UserRole::getRoleId, roleId)).forEach(
                userRole -> cacheManager.getCache(CacheConsts.USER_CACHE_NAME).evictIfPresent(userRole.getUserId()));
    }


    public List<PermissionView> getPermissions() {
        return PreAuthorizeAnnotationExtractor.extractAllApiPermissions().stream().map(x -> new PermissionView(x))
                .collect(Collectors.toList());
    }

    public void extractCodeDiffDbPermissions() {
        // TODO:
    }
}

