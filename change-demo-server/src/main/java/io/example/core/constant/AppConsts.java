package io.example.core.constant;

/**
 * @author javahuang
 * @date 2021/8/6
 */
public class AppConsts {

    /**
     * 单位名称，6 本研究
     */
    public static final String projectCode = "6";

    /**
     * cookie 保存的 token
     */
    public static final String COOKIE_TOKEN_NAME = "session";

    /**
     * 小程序的 openid
     */
    public static final String OPEN_ID_HEADER = "openid";

    /**
     * NCC的编码
     */
    public static final String NCC_CODE = "9999";

    /**
     * 逻辑删除列名
     */
    public static final String COLUMN_IS_DELETED = "is_deleted";

    /**
     * 管理员角色
     */
    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    /**
     * 匿名用户 ID
     */
    public static final String ANONYMOUS_USER_ID = "guest";

    /**
     * 当前机构 ID 变量名
     */
    public static final String VARIABLE_CURRENT_ORG_ID = "currentOrgId";

    /**
     * 父机构 ID 变量名
     */
    public static final String VARIABLE_PARENT_ORG_ID = "parentOrgId";

    /**
     * 鉴权方式
     */
    public enum AUTH_TYPE {
        // 账号密码
        PWD,
        // 小程序的OpenID
        OPENID
    }

    public interface PermType {

        String PROJECT = "project";

    }

}
