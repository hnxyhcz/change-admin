package io.example.domain.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

// @formatter:off
public record AuthRequest(
    @NotNull @Email String username,
    @NotNull String password,
    @NotNull String captcha,
    Boolean autoLogin
) {
    public AuthRequest() {
        this(null, null, null, null);
    }
}
