package io.example.mybatis.generator;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.IFill;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.config.TemplateType;
import com.baomidou.mybatisplus.generator.fill.Property;
import io.example.core.base.service.BaseService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * 代码生成器: @see <a href="https://baomidou.com/pages/981406/">配置</a>
 *
 * @author huang.cz
 * @since 2022/6/5 18:27
 */
@SpringBootTest
public class MybatisGenerator {

    @Value("${spring.datasource.url}")
    private String url;
    @Value("${spring.datasource.username}")
    private String username;
    @Value("${spring.datasource.password}")
    private String password;

    @Test
    public void run() {
        // 是否生成mapper的xml文件（true: 生成，false: 不生成）
        boolean isGenerateXML = true;

        // 要生成的表名
        List<String> tableList = Arrays.asList("t_comm_dict_distinct");

        // 代码输出路径
        String projectPath = System.getProperty("user.dir");
        String parentPackage = "io.example";
        String controllerPath = "web.controller";
        String servicePath = "data.service";
        String serviceImplPath = "data.service.impl";
        String entityPath = "data.domain.model";
        String viewDTOPath = "data.domain.dto";
        String mapperPath = "data.mapper";
        String mapperXmlPath = projectPath + "/src/main/resources/mapper";

        // 自动填充字段
        List<IFill> fillList = new ArrayList<>();
        fillList.add(new Property("createAt", FieldFill.INSERT));
        fillList.add(new Property("createBy", FieldFill.INSERT));
        fillList.add(new Property("updateAt", FieldFill.UPDATE));
        fillList.add(new Property("updateBy", FieldFill.UPDATE));

        // 创建代码生成器
        FastAutoGenerator autoGenerator = FastAutoGenerator.create(url, username, password);

        // 全局配置(GlobalConfig)
        autoGenerator.globalConfig(builder -> {
            builder.author("huang.cz") // 设置作者
                    // .enableSwagger() // 开启 swagger 模式
                    .disableOpenDir() // 禁止打开输出目录
                    .outputDir(projectPath + "/src/main/java"); // 指定输出目录
        });

        // 包配置(PackageConfig)
        autoGenerator.packageConfig(builder -> {
            builder.parent(parentPackage) // 设置父包名
                    .controller(controllerPath) // 设置controller包路径
                    .service(servicePath) // 设置service包路径
                    .serviceImpl(serviceImplPath) // 设置serviceImpl包路径
                    .entity(entityPath) // 设置entity包路径
                    .mapper(mapperPath) // 设置mapper包路径
                    .other(viewDTOPath) // 自定义xxView代码生成
                    .pathInfo(Collections.singletonMap(OutputFile.xml, mapperXmlPath)); // 设置mapperXml生成路径
        });

        // 策略配置(StrategyConfig)
        autoGenerator.strategyConfig(builder -> {
            builder.addInclude(tableList) // 设置需要生成的表名
                    .addTablePrefix("t_", "c_"); // 设置过滤表前缀
            // Entity 策略配置
            builder.entityBuilder()
                    .enableLombok() // 开启lombok注解
                    .enableTableFieldAnnotation() // 生成实体时生成字段注解
                    .addTableFills(fillList); // 添加表字段填充
            // Controller 策略配置
            builder.controllerBuilder()
                    .enableRestStyle() // 生成@RestController 控制器
                    .formatFileName("%sController"); // 格式化文件名称
            // Service 策略配置
            builder.serviceBuilder()
                    .superServiceImplClass(BaseService.class)
                    .formatServiceFileName("%sService") // 格式化 service 接口文件名称
                    .formatServiceImplFileName("%sServiceImpl"); // 格式化 service 实现类文件名称
            // Mapper 策略配置
            builder.mapperBuilder()
                    .formatMapperFileName("%sMapper"); // 格式化 mapper 文件名称
        });

        // 模板配置(TemplateConfig)
        autoGenerator.templateConfig(builder -> {
            // 是否禁用xml模板生成
            if (!isGenerateXML) {
                builder.disable(TemplateType.XML);
            }
            // 自定义 entity 模板（这里的模板springdoc会报错，所以去掉了，如果需要从mybatis-plus项目去拿模板）
            builder.entity("/templates/entity.java");
            // 自定义 controller 模板
            builder.controller("/templates/controller.java");
            // 自定义 serviceImpl 模板
            builder.serviceImpl("/templates/serviceImpl.java");
        });

        // 注入配置(InjectionConfig)
        autoGenerator.injectionConfig(builder -> {
            // View模板
            builder.customFile(Collections.singletonMap("View.java", "/templates/view.java.ftl"));
        });

        // 使用Freemarker引擎模板，默认的是Velocity引擎模板
        // autoGenerator.templateEngine(new FreemarkerTemplateEngine());
        autoGenerator.templateEngine(new EnhanceFreemarkerTemplateEngine());

        // 执行
        autoGenerator.execute();
    }
}
