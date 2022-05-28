package io.example.core.utils;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ReflectUtil;
import io.example.core.annotation.RelationGlobalDict;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;

/**
 * @author javahuang
 * @date 2022/5/16
 */
public class MyModelUtils {

    /**
     * 在主Model类型中，根据thisRelationField字段的RelationGlobalDict注解参数，全局字典dictMap中的字典数据，
     * 逐个关联到thisModelList每一个元素的thisRelationField字段中。
     *
     * @param thisClazz         主对象的Class对象。
     * @param thisModelList     主对象列表。
     * @param dictMap           全局字典数据。
     * @param thisRelationField 主表对象中保存被关联对象的字段名称。
     * @param <T>               主表对象类型。
     */
    public static <T> void makeGlobalDictRelation(
            Class<T> thisClazz, List<T> thisModelList, Map<Serializable, String> dictMap, String thisRelationField) {
        if (MapUtil.isEmpty(dictMap) || CollUtil.isEmpty(thisModelList)) {
            return;
        }
        // 这里不做任何空值判断，从而让配置错误在调试期间即可抛出
        Field thisTargetField = ReflectUtil.getField(thisClazz, thisRelationField);
        RelationGlobalDict r = thisTargetField.getAnnotation(RelationGlobalDict.class);
        Field masterIdField = ReflectUtil.getField(thisClazz, r.masterIdField());
        thisModelList.forEach(thisModel -> {
            if (thisModel != null) {
                Object id = ReflectUtil.getFieldValue(thisModel, masterIdField);
                if (id != null) {
                    String name = dictMap.get(id.toString());
                    ReflectUtil.setFieldValue(thisModel, thisTargetField, name);
                }
            }
        });
    }
}
