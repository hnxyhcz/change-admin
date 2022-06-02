package io.example.data.domain.mapper;

import io.example.core.base.mapper.BaseModelMapper;
import io.example.core.utils.ContextHelper;
import io.example.data.domain.dto.CurrentUser;
import io.example.data.domain.dto.UserRequest;
import io.example.data.domain.dto.UserView;
import io.example.data.domain.model.Account;
import io.example.data.domain.model.User;
import io.example.data.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


/**
 * @author javahuang
 * @date 2021/8/24
 */
@Mapper
public interface UserViewMapper extends BaseModelMapper<UserRequest, UserView, User> {

    /**
     * User对象转换成UserInfo对象
     *
     * @param user
     * @return
     */
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "userId", source = "id")
    CurrentUser toUserInfo(User user);

    @Mapping(source = "authAccount", target = "username")
    @Mapping(source = "authSecret", target = "password")
    CurrentUser toUserView(Account account);

    default CurrentUser toUserViewById(String id) {
        if (id == null) {
            return null;
        }
        UserMapper userMapper = ContextHelper.getBean(UserMapper.class);
        return toUserInfo(userMapper.selectById(id));
    }

    @Mapping(target = "authAccount", source = "username")
    @Mapping(target = "userId", source = "id")
    Account toAccount(UserRequest request);

}
