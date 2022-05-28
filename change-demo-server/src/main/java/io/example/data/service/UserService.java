package io.example.data.service;

import com.baomidou.mybatisplus.extension.service.IService;
import io.example.core.entity.PaginationResponse;
import io.example.data.domain.dto.UserQuery;
import io.example.data.domain.dto.UserRequest;
import io.example.data.domain.dto.UserView;
import io.example.data.domain.model.User;
import io.example.data.domain.model.UserInfo;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Set;

/**
 * @author huang.cz
 * @since 2022/5/26 11:13
 */
public interface UserService extends IService<User>, UserDetailsService {

    UserInfo loadUserById(String userId);

    PaginationResponse<UserView> getUsers(UserQuery query);

    void createUser(UserRequest request);

    void updateUser(UserRequest request);

    void deleteUser(String id);

    boolean checkUsernameExist(String username);

    Set<String> getUserGroups(String userId);

    PaginationResponse<UserView> listUser(UserQuery query);

    void createOrUpdateUser(UserRequest request);
}

