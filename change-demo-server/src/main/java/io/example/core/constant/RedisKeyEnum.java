package io.example.core.constant;

/**
 * @author javahuang
 * @date 2022/5/10
 */
public enum RedisKeyEnum {
    /**
     * 字典
     */
    dict,
    /**
     * session
     */
    session;


    /**
     * @param suffix 后缀
     * @return
     */
    public String getKey(String suffix) {
        return this.name() + ":" + suffix;
    }
}
