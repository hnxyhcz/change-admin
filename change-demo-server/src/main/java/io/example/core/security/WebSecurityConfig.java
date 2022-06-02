package io.example.core.security;

import io.example.core.security.filter.AuthenticateTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import static java.lang.String.format;

/**
 * @author change
 */
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, jsr250Enabled = true, prePostEnabled = true)
@RequiredArgsConstructor
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserDetailsService userDetailsService;
    private final LogoutSuccessHandler logoutSuccessHandler;
    private final AuthenticateTokenFilter authenticateTokenFilter;

    @Value("${springdoc.api-docs.path}")
    private String restApiDocPath;
    @Value("${springdoc.swagger-ui.path}")
    private String swaggerPath;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);
    }

    /**
     * 全局忽略访问限制,
     */
    @Override
    public void configure(WebSecurity web) {
        // Swagger接口可公开访问
        web.ignoring().antMatchers("/");
        web.ignoring().antMatchers(format("%s/**", restApiDocPath));
        web.ignoring().antMatchers(format("%s/**", swaggerPath));
        // ignore是完全绕过了spring security的所有filter
        web.ignoring().antMatchers("/api/public/**");
        web.ignoring().antMatchers("/api/captcha/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // 启用 CORS 并禁用 CSRF
        http = http.cors().and().csrf().disable();
        // 将会话管理设置为无状态
        http = http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and();

        // @formatter:off
        // 设置接口权限，permitAll之后仍然会走过滤器
        http.authorizeRequests()
                .antMatchers("/api/**").authenticated()
                .antMatchers("/").permitAll()
        ;

        // 登出
        http.logout().logoutUrl("/api/public/logout").logoutSuccessHandler(logoutSuccessHandler);

        // 拦截token，刷新token失效时间
        http.addFilterBefore(authenticateTokenFilter, UsernamePasswordAuthenticationFilter.class);
        // @formatter:on
    }

    /**
     * 设置密码加密算法
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 由spring security启用CROS
     */
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    /**
     * Expose authentication manager bean
     */
    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
