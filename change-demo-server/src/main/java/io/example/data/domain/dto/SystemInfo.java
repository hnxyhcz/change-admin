package io.example.data.domain.dto;

import lombok.Data;

import java.util.List;

/**
 * @author javahuang
 * @date 2022/2/11
 */
@Data
public class SystemInfo {

    /**
     * 主键
     */
    private String id;

    /**
     * 系统名称
     */
    private String title;

    /**
     * 系统描述信息
     */
    private String description;

    /**
     * 图标
     */
    private String logo;

    /**
     * 图标
     */
    private String bacgImage;

    /**
     * 默认语言
     */
    private String locale;

    /**
     * 默认语言
     */
    private String version;

    private RegisterInfo registerInfo;

    @Data
    public static class RegisterInfo {

        /**
         * 是否开启注册
         */
        private Boolean registerEnabled;

        /**
         * 注册用户可选角色列表
         */
        private List<String> roles;

        /**
         * 开启强密码验证
         */
        private Boolean strongPasswordEnabled;

    }

}
