package io.example.core.base.service;

import java.util.List;
import java.util.stream.Collectors;

import io.example.core.constant.RedisKeyEnum;
import io.example.core.utils.ContextHelper;
import io.example.data.domain.dto.CommDictItemView;
import org.springframework.data.redis.core.RedisTemplate;


/**
 * @author javahuang
 * @date 2022/5/24
 */
public interface BaseDictService {

    /**
     * 删除缓存
     */
    default void evictDictCache() {
        RedisTemplate redisTemplate = ContextHelper.getBean("redisTemplate");
        redisTemplate.delete(RedisKeyEnum.dict.getKey(getDictCode()));
    }

    /**
     * 全量刷新缓存
     */
    default List<CommDictItemView> refreshDictCache() {
        this.evictDictCache();
        List<CommDictItemView> items = getDictItems();
        RedisTemplate redisTemplate = ContextHelper.getBean("redisTemplate");
        redisTemplate.opsForHash().putAll(RedisKeyEnum.dict.getKey(getDictCode()),
                items.stream().collect(Collectors.toMap(CommDictItemView::getItemCode, CommDictItemView::getItemName)));
        return items;
    }

    /**
     * 删除单个的 key，通常在删除实体的时候调用
     *
     * @param key
     */
    default void cacheEvictByKey(String key) {
        RedisTemplate redisTemplate = ContextHelper.getBean("redisTemplate");
        redisTemplate.opsForHash().delete(RedisKeyEnum.dict.getKey(getDictCode()), key);
    }

    /**
     * 更新缓存条目，通常在更新实体的时候调用
     *
     * @param key
     * @param value
     */
    default void cachePutByKey(String key, String value) {
        RedisTemplate redisTemplate = ContextHelper.getBean("redisTemplate");
        redisTemplate.opsForHash().put(RedisKeyEnum.dict.getKey(getDictCode()), key, value);
    }

    /**
     * 创建cache
     */
    List<CommDictItemView> getDictItems();

    String getDictCode();
}
