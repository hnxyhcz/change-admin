package io.example.utils;

import java.io.IOException;
import java.text.SimpleDateFormat;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.nimbusds.jose.shaded.json.JSONObject;

import lombok.extern.slf4j.Slf4j;

/**
 * JSON转换工具
 * 
 * @author huang.cz
 * @since 2022/4/15 23:14
 */
@Slf4j
public class JsonUtil {

    private static ObjectMapper objectMapper = new ObjectMapper();

    static {
        objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
        objectMapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
        objectMapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
    }

    /**
     * 将对象序列化为JSON
     *
     * @param object 对象
     * @return JSON格式
     */
    public static String toJSONString(Object object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            log.error("序列化失败!" + e.getMessage());
            return null;
        }
    }

    /**
     * JSON反序列化对象
     *
     * @param str 反序列化的JSON串
     * @param clazz 反序列化的目标对象
     * @return T 对象
     */
    public static <T> T parseObject(String str, Class<T> clazz) {
        try {
            return objectMapper.readValue(str, clazz);
        } catch (IOException e) {
            log.error("反序列化失败", e);
            return null;
        }
    }

    /**
     * JSON反序列化对象
     *
     * @param jsonObj 反序列化的JSON对象
     * @param clazz 反序列化的目标对象
     * @return T 对象
     */
    public static <T> T parseObject(JSONObject jsonObj, Class<T> clazz) {
        if (jsonObj != null) {
            return parseObject(jsonObj.toJSONString(), clazz);
        }
        return null;
    }

    /**
     * 带泛型的反序列化
     *
     * @param str 待序列化的字符串
     * @param superClazz superClazz
     * @param clazz 泛型对象
     * @return 序列化为泛型对象
     */
    public static <S, T> S parseObject(String str, Class<S> superClazz, Class<T> clazz) {
        JavaType javaType = getCollectionType(superClazz, clazz);
        try {
            return objectMapper.readValue(str, javaType);
        } catch (JsonProcessingException e) {
            log.error("反序列化失败", e);
            return null;
        }
    }

    public static JavaType getCollectionType(Class<?> collectionClass, Class<?>... elementClasses) {
        return objectMapper.getTypeFactory().constructParametricType(collectionClass, elementClasses);
    }

}
