package io.example.core.mybatis;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import io.example.core.utils.SecurityUtils;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * @author javahuang
 * @date 2021/8/31
 */
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createAt", Date::new, Date.class);
        this.strictInsertFill(metaObject, "createBy", SecurityUtils::getUserId, String.class);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updateAt", Date::new, Date.class);
        this.strictUpdateFill(metaObject, "updateBy", SecurityUtils::getUserId, String.class);
    }

}
