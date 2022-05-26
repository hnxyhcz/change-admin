package io.example.api;

import io.example.domain.dto.*;
import io.example.domain.model.Role;
import io.example.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;

/**
 * @author huang.cz
 * @since 2022/4/16 23:10
 */
@Tag(name = "User")
@RestController
@RequestMapping(path = "api/user")
@RolesAllowed(Role.USER_ADMIN)
@RequiredArgsConstructor
public class UserApi {

    private final UserService userService;

    @PostMapping
    public UserView create(@RequestBody @Valid CreateUserRequest request) {
        return userService.create(request);
    }

    @PutMapping("{id}")
    public UserView update(@PathVariable String id, @RequestBody @Valid UpdateUserRequest request) {
        return userService.update(new ObjectId(id), request);
    }

    @DeleteMapping("{id}")
    public UserView delete(@PathVariable String id) {
        return userService.delete(new ObjectId(id));
    }

    @GetMapping("{id}")
    public UserView get(@PathVariable String id) {
        return userService.getUser(new ObjectId(id));
    }

    @PostMapping("search")
    public ListResponse<UserView> search(@RequestBody SearchRequest<SearchUsersQuery> request) {
        return new ListResponse<>(userService.searchUsers(request.page(), request.query()));
    }

    /**
     * PreAuthorize根据SPEL表达式判断权限（这里表示只能删除自己）
     * @param username
     * @return
     */
    @DeleteMapping("username")
    @PreAuthorize("authentication.name.equals(#username)")
    public void deleteByUsername(String username) {
        // TODO 根据用户名删除
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        System.out.println(currentPrincipalName);
    }
}
