package io.example.core.base.service;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ReflectUtil;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import io.example.core.annotation.RelationConstDict;
import io.example.core.annotation.RelationDict;
import io.example.core.annotation.RelationGlobalDict;
import io.example.core.entity.PageQuery;
import io.example.core.utils.ContextHelper;
import io.example.core.utils.MyModelUtils;
import lombok.Data;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.util.*;

import static java.util.stream.Collectors.toSet;

/**
 * @author javahuang
 * @date 2022/5/9
 */
public class BaseService<M extends BaseMapper<T>, T, V> extends ServiceImpl<M, T> {

    protected final Class<T> modelClass;

    protected final Class<V> viewClass;

    /**
     * 当前Service关联的主Model对象的所有字典关联的结构列表，该字段在系统启动阶段一次性预加载，提升运行时效率。
     */
    protected final List<RelationStruct> localRelationDictStructList = new LinkedList<>();

    /**
     * 当前Service关联的主Model对象的所有常量字典关联的结构列表，该字段在系统启动阶段一次性预加载，提升运行时效率。
     */
    protected final List<RelationStruct> relationConstDictStructList = new LinkedList<>();

    /**
     * 当前Service关联的全局字典对象的结构列表，该字段在系统启动阶段一次性预加载，提升运行时效率。
     */
    protected final List<RelationStruct> relationGlobalDictStructList = new LinkedList<>();

    public BaseService() {
        Class<?> type = getClass();
        while (!(type.getGenericSuperclass() instanceof ParameterizedType)) {
            type = type.getSuperclass();
        }
        modelClass = (Class<T>) ((ParameterizedType) type.getGenericSuperclass()).getActualTypeArguments()[1];
        viewClass = (Class<V>) ((ParameterizedType) type.getGenericSuperclass()).getActualTypeArguments()[2];
    }

    public <E extends IPage<T>> Page<T> pageByQuery(PageQuery pageQuery) {
        Page<T> page = new Page<T>(pageQuery.getCurrent(), pageQuery.getPageSize());
        return super.page(page);
    }

    public <E extends IPage<T>> Page pageByQuery(PageQuery pageQuery, Wrapper<T> queryWrapper) {
        Page<T> page = new Page<T>(pageQuery.getCurrent(), pageQuery.getPageSize());
        return super.page(page, queryWrapper);
    }

    public void loadRelationStruct() {
        Field[] fields = ReflectUtil.getFields(viewClass);
        for (Field f : fields) {
            initializeRelationDictStruct(f);
        }
    }

    /**
     * 为实体对象参数列表数据集成全局字典关联数据。
     *
     * @param resultList   主表数据列表。
     * @param ignoreFields 该集合中的字段，即便包含注解也不会在当前调用中进行数据组装。
     */
    public void buildGlobalDictForDataList(List<V> resultList, Set<String> ignoreFields) {
        if (CollUtil.isEmpty(this.relationGlobalDictStructList) || CollUtil.isEmpty(resultList)) {
            return;
        }
        for (RelationStruct relationStruct : this.relationGlobalDictStructList) {
            if (ignoreFields != null && ignoreFields.contains(relationStruct.relationField.getName())) {
                continue;
            }
            Set<Object> masterIdSet = resultList.stream()
                    .map(obj -> ReflectUtil.getFieldValue(obj, relationStruct.masterIdField))
                    .filter(Objects::nonNull)
                    .collect(toSet());
            if (CollUtil.isNotEmpty(masterIdSet)) {
                Map<Serializable, String> dictMap = ReflectUtil.invoke(
                        relationStruct.service,
                        relationStruct.globalDictMethod,
                        relationStruct.relationGlobalDict.dictCode().name(), masterIdSet);

                MyModelUtils.makeGlobalDictRelation(
                        viewClass, resultList, dictMap, relationStruct.relationField.getName());
            }
        }
    }

    /**
     * 为参数实体对象数据集成全局字典关联数据。
     *
     * @param dataObject   实体对象。
     * @param ignoreFields 该集合中的字段，即便包含注解也不会在当前调用中进行数据组装。
     */
    private <T extends M> void buildGlobalDictForData(T dataObject, Set<String> ignoreFields) {
        if (dataObject == null || CollUtil.isEmpty(this.relationGlobalDictStructList)) {
            return;
        }
        for (RelationStruct relationStruct : this.relationGlobalDictStructList) {
            if (ignoreFields != null && ignoreFields.contains(relationStruct.relationField.getName())) {
                continue;
            }
            Object id = ReflectUtil.getFieldValue(dataObject, relationStruct.masterIdField);
            if (id != null) {
                Map<Serializable, String> dictMap = ReflectUtil.invoke(
                        relationStruct.service,
                        relationStruct.globalDictMethod,
                        relationStruct.relationGlobalDict.dictCode(), CollUtil.newHashSet(id));
                String name = dictMap.get(id.toString());
                if (name != null) {
                    Map<String, Object> reulstDictMap = new HashMap<>(2);
                    reulstDictMap.put("id", id);
                    reulstDictMap.put("name", name);
                    ReflectUtil.setFieldValue(dataObject, relationStruct.relationField, reulstDictMap);
                }
            }
        }
    }


    @SuppressWarnings("unchecked")
    private void initializeRelationDictStruct(Field f) {
        RelationConstDict relationConstDict = f.getAnnotation(RelationConstDict.class);
        if (relationConstDict != null) {
            RelationStruct relationStruct = new RelationStruct();
            relationStruct.relationConstDict = relationConstDict;
            relationStruct.relationField = f;
            relationStruct.masterIdField = ReflectUtil.getField(viewClass, relationConstDict.masterIdField());
            Field dictMapField = ReflectUtil.getField(relationConstDict.constantDictClass(), "DICT_MAP");
            relationStruct.dictMap = (Map<Object, String>) ReflectUtil.getStaticFieldValue(dictMapField);
            this.relationConstDictStructList.add(relationStruct);
            return;
        }
        RelationGlobalDict relationGlobalDict = f.getAnnotation(RelationGlobalDict.class);
        if (relationGlobalDict != null) {
            RelationStruct relationStruct = new RelationStruct();
            relationStruct.relationGlobalDict = relationGlobalDict;
            relationStruct.relationField = f;
            relationStruct.masterIdField = ReflectUtil.getField(viewClass, relationGlobalDict.masterIdField());
            relationStruct.service = ContextHelper.getBean("commDictServiceImpl");
            relationStruct.globalDictMethod = ReflectUtil.getMethodByName(
                    relationStruct.service.getClass(), "getGlobalDictItemDictMapFromCache");
            relationGlobalDictStructList.add(relationStruct);
            return;
        }
    }


    @Data
    public static class RelationStruct {
        private Field relationField;
        private Field masterIdField;
        private Field equalOneToOneRelationField;
        private Method globalDictMethod;
        private BaseService service;
        private Map<Object, String> dictMap;
        private RelationConstDict relationConstDict;
        private RelationGlobalDict relationGlobalDict;
        private RelationDict relationDict;
    }

}
