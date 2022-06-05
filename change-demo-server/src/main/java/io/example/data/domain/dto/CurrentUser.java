package io.example.data.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author huang.cz
 * @since 2022/5/26 11:47
 */
@Data
public class CurrentUser implements UserDetails, Serializable {

    /**
     * 用户id
     */
    private String userId;

    /**
     * 用户类型
     */
    private Integer userType;

    /**
     * 用户名
     */
    private String name;

    /**
     * 性别
     */
    private String gender;

    /**
     * 头像
     */
    private String avatar;

    private String lccCode;

    private String lccName;

    private String phone;

    private String email;

    private Boolean enabled;

    @JsonIgnore
    private Boolean status;

    /**
     * 登录账号
     */
    @JsonIgnore
    private String username;

    @JsonIgnore
    private String password;

    private List<String> authorityList;

    @JsonIgnore
    private Set<GrantedAuthority> authorities = new HashSet<>();

    public CurrentUser() {
    }

    public CurrentUser(String username) {
        this.username = username;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    /**
     * 账户是否未过期，过期无法验证
     *
     * @return true: 未过期
     */
    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return isEnabled();
    }

    /**
     * 指定用户是否解锁，锁定的用户无法进行身份验证
     *
     * @return true 可以解锁
     */
    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return isEnabled();
    }

    /**
     * 指示是否已过期的用户的凭据(密码)，过期的凭据防止认证
     */
    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return isEnabled();
    }

    /**
     * 是否可用，禁用的用户不能身份验证
     *
     * @return true:可用
     */
    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(this.status);
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.authorityList == null) {
            return new ArrayList<>();
        }
        return this.authorityList.stream().map(authority -> (GrantedAuthority) () -> authority).collect(Collectors.toSet());
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public CurrentUser simpleMode() {
        CurrentUser currentUser = new CurrentUser();
        BeanUtils.copyProperties(this, currentUser, "authorityList");
        return currentUser;
    }

}
