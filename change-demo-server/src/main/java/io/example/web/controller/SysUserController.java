package io.example.web.controller;

import io.example.core.entity.PaginationResponse;
import io.example.data.domain.dto.UserQuery;
import io.example.data.domain.dto.UserRequest;
import io.example.data.domain.dto.UserView;
import io.example.data.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * @author huang.cz
 * @since 2022/4/16 23:10
 */
@Tag(name = "用户管理")
@RestController
@RequestMapping(path = "api/system/user")
@RequiredArgsConstructor
public class SysUserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('system:user:list')")
    public PaginationResponse<UserView> roles(UserQuery query) {
        return userService.getUsers(query);
    }

    @PostMapping()
    @PreAuthorize("hasAuthority('system:user:create')")
    public void createUser(@RequestBody @Valid UserRequest request) {
        userService.createUser(request);
    }

    @PatchMapping("{id}")
    @PreAuthorize("hasAuthority('system:user:update')")
    public void updateUser(@PathVariable("id") String id, @RequestBody @Valid UserRequest request) {
        request.setId(id);
        userService.updateUser(request);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAuthority('system:user:delete')")
    public void deleteUser(@PathVariable("id") String id) {
        userService.deleteUser(id);
    }

    @GetMapping("/checkUsernameExist")
    public boolean checkUsernameExist(String username) {
        return userService.checkUsernameExist(username);
    }


}
