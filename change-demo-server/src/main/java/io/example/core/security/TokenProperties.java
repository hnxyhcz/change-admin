package io.example.core.security;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * @author huang.cz
 * @since 2022/5/26 22:02
 */
@Data
@EqualsAndHashCode
@ToString
@Configuration
@ConfigurationProperties("custom.token")
public class TokenProperties {
    /**
     * 令牌自定义标识
     */
    private String header = "Authorization";

    /**
     * 令牌前缀
     */
    private String prefix = "Bearer ";

    /**
     * 过期时长
     */
    private Duration expireTime = Duration.ofMinutes(30L);
}
