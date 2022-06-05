package io.example.mybatis.generator;

import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;

import javax.validation.constraints.NotNull;
import java.io.File;
import java.util.Map;

/**
 * 代码生成器支持自定义[DTO\VO等]模版
 *
 * @author huang.cz
 * @since 2022/6/5 23:29
 */
public final class EnhanceFreemarkerTemplateEngine extends FreemarkerTemplateEngine {

    @Override
    protected void outputCustomFile(@NotNull Map<String, String> customFile, @NotNull TableInfo tableInfo, @NotNull Map<String, Object> objectMap) {
        String entityName = tableInfo.getEntityName();
        String otherPath = this.getPathInfo(OutputFile.other);
        customFile.forEach((key, value) -> {
            String fileName = String.format(otherPath + File.separator + entityName + "%s", key);
            this.outputFile(new File(fileName), objectMap, value, this.getConfigBuilder().getInjectionConfig().isFileOverride());
        });
    }
}