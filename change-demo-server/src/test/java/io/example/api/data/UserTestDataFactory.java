package io.example.api.data;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.example.domain.dto.CreateUserRequest;
import io.example.domain.dto.UserView;
import io.example.service.UserService;

@Service
public class UserTestDataFactory {

    @Autowired
    private UserService userService;

    public UserView createUser(String username, String fullName, String password) {
        CreateUserRequest createRequest = new CreateUserRequest(username, fullName, password, password);

        UserView userView = userService.create(createRequest);

        assertNotNull(userView.getId(), "User id must not be null!");
        assertEquals(fullName, userView.getFullName(), "User name update isn't applied!");

        return userView;
    }

    public UserView createUser(String username, String fullName) {
        return createUser(username, fullName, "Test12345_");
    }

    public void deleteUser(String id) {
        userService.delete(new ObjectId(id));
    }

}
