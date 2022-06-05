package ${package.ServiceImpl};

import ${package.Entity}.${entity};
import ${package.Other}.${entity}View;
import ${package.Mapper}.${table.mapperName};
import ${package.Service}.${table.serviceName};
import ${superServiceImplClassPackage};
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * ${table.comment!} 服务实现类
 *
 * @author ${author}
 * @since ${date}
 */
@Service
@RequiredArgsConstructor
public class ${table.serviceImplName} extends ${superServiceImplClass}<${table.mapperName}, ${entity}, ${entity}View> implements ${table.serviceName} {

}