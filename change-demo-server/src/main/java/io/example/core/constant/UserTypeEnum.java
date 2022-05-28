package io.example.core.constant;

/**
 * @author javahuang
 * @date 2022/5/23
 */
public enum UserTypeEnum {
    /**
     * 管理员用户
     */
    ADMIN(0),
    /**
     * 小程序用户
     */
    WECHAT_USER(1),
    /**
     * ncc用户
     */
    NCC_USER(2),
    /**
     * lcc用户
     */
    LCC_USER(3);

    private int type;

    UserTypeEnum(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
