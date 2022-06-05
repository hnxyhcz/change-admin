package io.example.data.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.github.pagehelper.PageHelper;
import io.example.core.base.service.BaseDictService;
import io.example.core.base.service.BaseService;
import io.example.core.constant.*;
import io.example.core.entity.PaginationResponse;
import io.example.core.exception.InternalServerException;
import io.example.core.security.PreAuthorizeAnnotationExtractor;
import io.example.core.utils.PageUtils;
import io.example.core.utils.SecurityUtils;
import io.example.data.domain.dto.*;
import io.example.data.domain.mapper.RoleViewMapper;
import io.example.data.domain.mapper.UserViewMapper;
import io.example.data.domain.model.*;
import io.example.data.mapper.AccountMapper;
import io.example.data.mapper.UserMapper;
import io.example.data.mapper.UserRoleMapper;
import io.example.data.service.LccService;
import io.example.data.service.RoleService;
import io.example.data.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static org.apache.commons.lang3.ObjectUtils.isNotEmpty;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class UserServiceImpl extends BaseService<UserMapper, User, UserView> implements UserService, BaseDictService {

    private final UserViewMapper userViewMapper;
    private final RoleViewMapper roleViewMapper;
    private final AccountMapper accountMapper;
    private final UserRoleMapper userRoleMapper;
    private final RoleService roleService;
    private final LccService lccService;

    /**
     * @param username 账号密码登录认证使用
     */
    @Override
    public CurrentUser loadUserByUsername(String username) throws UsernameNotFoundException {
        LambdaQueryWrapper<Account> queryWrapper = Wrappers.<Account>lambdaQuery().eq(Account::getAuthAccount, username);
        Account existAccount = accountMapper.selectOne(queryWrapper);
        if (existAccount == null) {
            throw new UsernameNotFoundException(format("用户: %s, 不存在", username));
        }
        User user = this.getById(existAccount.getUserId());
        if (Boolean.FALSE.equals(user.getStatus())) {
            throw new AccessDeniedException(format("用户: %s, 被禁用", username));
        }

        CurrentUser currentUser = loadCurrent(user);
        currentUser.setUsername(username);
        currentUser.setPassword(existAccount.getAuthSecret());
        return currentUser;
    }

    @Override
    @Cacheable(cacheNames = CacheConsts.USER_CACHE_NAME, key = "#p0", condition = "#p0!=null", unless = "#result == null")
    public CurrentUser loadUserById(String userId) {
        User user = this.getById(userId);
        if (user == null) {
            return null;
        }
        return loadCurrent(user);
    }

    private CurrentUser loadCurrent(User user) {
        CurrentUser currentUser = userViewMapper.toUserInfo(user);
        List<Role> roles = userRoleMapper
                .selectList(Wrappers.<UserRole>lambdaQuery().eq(UserRole::getUserId, user.getId()))
                .stream().map(ur -> roleService.getById(ur.getRoleId()))
                .filter(Objects::nonNull).toList();

        // 获取权限信息
        List<String> authorities = new ArrayList<>();
        if (UserTypeEnum.ADMIN.getType() == user.getUserType()) {
            // 管理员有所有权限
            authorities.add(AppConsts.ROLE_ADMIN);
            authorities.addAll(PreAuthorizeAnnotationExtractor.extractAllApiPermissions());
        } else {
            // 普通用户
            roles.forEach(role -> {
                authorities.add("ROLE_" + role.getCode());
                authorities.addAll(Arrays.asList(role.getAuthority().split(",")));
            });
        }
        currentUser.setAuthorityList(authorities);

        // 设置用户单位
        if (user.getLccCode() != null) {
            Lcc lcc = lccService.getById(user.getLccCode());
            if (lcc != null) {
                currentUser.setLccName(lcc.getLccName());
            }
        }

        return currentUser;
    }

    @Override
    public PaginationResponse<UserView> getUsers(UserQuery query) {
        Page<User> userPage = pageByQuery(query,
                Wrappers.<User>lambdaQuery().like(isNotBlank(query.getName()), User::getName, query.getName())
                        .in(query.getIds() != null, User::getId,
                                Arrays.asList(query.getIds() != null ? query.getIds() : new String[0])));
        return new PaginationResponse<>(userPage.getTotal(), userPage.getRecords().stream().map(x -> {
            UserView userView = userViewMapper.toView(x);
            Account account = accountMapper
                    .selectOne(Wrappers.<Account>lambdaQuery().eq(Account::getUserId, x.getId()));
            if (account != null) {
                userView.setUsername(account.getAuthAccount());
            }
            // 设置用户部门
            Lcc lcc = lccService.getById(x.getLccCode());
            if (lcc != null) {
                userView.setLccName(lcc.getLccName());
            }
            // 设置用户角色
            userView.setRoles(
                    userRoleMapper.selectList(Wrappers.<UserRole>lambdaQuery().eq(UserRole::getUserId, x.getId()))
                            .stream().map(userRole -> roleViewMapper.toView(roleService.getById(userRole.getRoleId())))
                            .collect(Collectors.toList()));

            return userView;
        }).collect(Collectors.toList()));
    }

    @Override
    public void createUser(UserRequest request) {
        User user = userViewMapper.fromRequest(request);
        this.save(user);

        // 创建登录账号
        Account account = userViewMapper.toAccount(request);
        if (isNotBlank(request.getOpenid())) {
            account.setAuthType(AppConsts.AUTH_TYPE.OPENID.name());
            account.setAuthAccount(request.getOpenid());
            account.setOpenid(request.getOpenid());
        } else {
            account.setAuthType(AppConsts.AUTH_TYPE.PWD.name());
            account.setAuthSecret(SecurityUtils.getPasswordEncoder().encode(request.getPassword()));
        }
        account.setUserId(user.getId());
        accountMapper.insert(account);

        // 添加用户角色
        request.setId(user.getId());
        addUserRoles(request);
        cachePutByKey(user.getId(), user.getName());
    }

    private void addUserRoles(UserRequest request) {
        if (!CollectionUtils.isEmpty(request.getRoles())) {
            request.getRoles().forEach(roleId -> {
                UserRole userRole = new UserRole();
                userRole.setUserId(request.getId());
                userRole.setRoleId(roleId);
                userRoleMapper.insert(userRole);
            });
        }
    }

    @Override
    @CacheEvict(cacheNames = "userCache", key = "#request.id")
    public void updateUser(UserRequest request) {
        if (request.getId() == null) {
            return;
        }
        User user = userViewMapper.fromRequest(request);
        this.updateById(user);

        if (request.getStatus() != null || isNotBlank(request.getPassword())) {
            // 更新登录账号
            Account account = accountMapper
                    .selectOne(Wrappers.<Account>lambdaQuery().eq(Account::getUserId, request.getId()));
            if (isNotBlank(request.getPassword()) && isNotBlank(request.getOldPassword())) {
                if (!SecurityUtils.getPasswordEncoder().matches(request.getOldPassword(), account.getAuthSecret())) {
                    throw new InternalServerException(ErrorCodeEnum.VALIDATION_ERROR);
                }
            }
            if (request.getUsername() != null) {
                account.setAuthAccount(request.getUsername());
            }
            if (isNotBlank(request.getPassword())) {
                account.setAuthSecret(SecurityUtils.getPasswordEncoder().encode(request.getPassword()));
            }
            if (account != null) {
                accountMapper.updateById(account);
            }
        }

        // 更新用户角色
        if (request.getRoles() != null) {
            userRoleMapper.delete(Wrappers.<UserRole>lambdaQuery().eq(UserRole::getUserId, request.getId()));
            addUserRoles(request);
        }
        cachePutByKey(user.getId(), user.getName());
    }

    @Override
    @CacheEvict(cacheNames = "userCache", key = "#id")
    public void deleteUser(String id) {
        removeById(id);
        accountMapper.delete(Wrappers.<Account>lambdaQuery().eq(Account::getUserId, id));
        cacheEvictByKey(id);
    }

    @Override
    public boolean checkUsernameExist(String username) {
        Account account = accountMapper
                .selectOne(Wrappers.<Account>lambdaQuery().eq(Account::getAuthAccount, username));
        return account != null;
    }

    @Override
    public Set<String> getUserGroups(String userId) {
        Set<String> groups = new LinkedHashSet<>();
        // 获取用户的系统角色
        userRoleMapper.selectList(Wrappers.<UserRole>lambdaQuery().eq(UserRole::getUserId, userId)).forEach(role -> {
            groups.add("R:" + role.getRoleId());
        });
        groups.add("U:" + userId);
        return groups;
    }

    @Override
    public PaginationResponse<UserView> listUser(UserQuery query) {
        PageHelper.startPage(query.getCurrent(), query.getPageSize());
        List<User> page = list(Wrappers.<User>lambdaQuery()
                .like(isNotBlank(query.getName()), User::getName, query.getName())
                .eq(query.getLccCode() != null, User::getLccCode, query.getLccCode())
                .in(User::getUserType, Arrays.asList(UserTypeEnum.NCC_USER.getType(), UserTypeEnum.LCC_USER.getType()))
                .in(isNotEmpty(query.getIds()), User::getId, query.getIds())
//                .eq(query.getLccCode() == null, User::getLccCode, AppConsts.NCC_CODE) // 默认显示项目办公室人员
                .last(query.getSorter() != null, query.getSorter()));
        PaginationResponse<UserView> result = PageUtils.makeResponseData(page, userViewMapper, this);

        return result;
    }

    @Override
    public void createOrUpdateUser(UserRequest request) {
        if (request.getId() != null) {
            updateById(userViewMapper.fromRequest(request));
        } else {
            User user = userViewMapper.fromRequest(request);
            if (AppConsts.NCC_CODE.equals(user.getLccCode())) {
                user.setUserType(UserTypeEnum.NCC_USER.getType());
            }
            save(user);
        }
    }

    @Override
    public List<CommDictItemView> getDictItems() {
        return list().stream().filter(user -> user.getName() != null).map(user -> CommDictItemView.builder().dictCode(getDictCode())
                .itemName(user.getName()).itemCode(user.getId()).build()).collect(Collectors.toList());
    }

    @Override
    public String getDictCode() {
        return DictCodeEnum.user.name();
    }
}




