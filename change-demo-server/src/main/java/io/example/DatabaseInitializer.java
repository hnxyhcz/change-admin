package io.example;

import io.example.annotation.ApiOperation;
import io.example.domain.dto.CreateUserRequest;
import io.example.domain.model.Api;
import io.example.domain.model.Role;
import io.example.service.ApiService;
import io.example.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.condition.RequestMethodsRequestCondition;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * @author change
 */
@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements ApplicationListener<ApplicationReadyEvent> {

    private final List<String> usernames = List.of("user@hotmail.com", "author@hotmail.com", "book@hotmail.com");
    private final List<String> fullNames = List.of("User Admin", "Author Admin", "Book Admin");
    private final List<String> roles = List.of(Role.USER_ADMIN, Role.AUTHOR_ADMIN, Role.BOOK_ADMIN);
    private final String password = "123456";

    private final ApiService apiService;
    private final UserService userService;
    private final WebApplicationContext applicationContext;

    /**
     * 初始化账号
     */
    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        for (int i = 0; i < usernames.size(); ++i) {
            // @formatter:off
            CreateUserRequest request = new CreateUserRequest(
                usernames.get(i),
                fullNames.get(i),
                password,
                password,
                Set.of(roles.get(i))
            );
            // @formatter:on
            userService.upsert(request);
        }
    }

    /**
     * 初始化api接口, 用于请求后台接口鉴权操作
     * <p>
     * 需要联合swagger中的@Tag和@ApiOperation注解联合使用
     * </p>
     */
    @PostConstruct
    public void doInitApiData() {
        // 获取启动类的包名，根据启动类包名查询api接口
        String applicationPackage = ClassUtils.getPackageName(Application.class);
        // 获取RequestMapping注解的类和方法的对应信息
        RequestMappingHandlerMapping mapping = applicationContext.getBean(RequestMappingHandlerMapping.class);
        Map<RequestMappingInfo, HandlerMethod> map = mapping.getHandlerMethods();
        List<ObjectId> apiIdList = new ArrayList<>();
        for (Map.Entry<RequestMappingInfo, HandlerMethod> m : map.entrySet()) {
            HandlerMethod method = m.getValue();
            // 获取当前应用下的所有api
            if (method.toString().startsWith(applicationPackage)) {
                // 获取class类上的Tag注解
                Tag tag = method.getBeanType().getAnnotation(Tag.class);
                String group = tag.name();
                // 获取RequestMapping注解的方法
                RequestMappingInfo info = m.getKey();
                assert info.getPathPatternsCondition() != null;
                String path = info.getPathPatternsCondition().getFirstPattern().getPatternString();
                RequestMethodsRequestCondition methodsCondition = info.getMethodsCondition();
                for (RequestMethod requestMethod : methodsCondition.getMethods()) {
                    String httpMethod = requestMethod.toString();
                    Api api = new Api(path, httpMethod, group);
                    ApiOperation apiOperation = method.getMethodAnnotation(ApiOperation.class);
                    if (apiOperation != null) {
                        api.setSummary(apiOperation.summary());
                        api.setAnonymous(apiOperation.anonymous());
                        // 如果ApiOperation有标记组别，则使用ApiOperation上的
                        if (StringUtils.hasText(apiOperation.group())) {
                            api.setGroup(group);
                        }
                    }
                    Api result = apiService.upsert(api);
                    apiIdList.add(result.getId());
                }
            }
        }
        // 删除多余的接口（如果前端有对数据权限的新增修改功能，将改行注释，避免误删）
        apiService.deleteIdNin(apiIdList);
    }
}
