package io.example.core.utils;

import com.github.pagehelper.Page;
import io.example.core.base.mapper.BaseModelMapper;
import io.example.core.base.service.BaseService;
import io.example.core.entity.PaginationResponse;
import org.apache.commons.collections4.CollectionUtils;

import java.util.List;

/**
 * @author javahuang
 * @date 2022/5/13
 */
public class PageUtils {

    /**
     * 用户构建带有分页信息的数据列表。
     *
     * @param dataList 数据列表，该参数必须是调用PageMethod.startPage之后，立即执行mybatis查询操作的结果集。
     * @return 返回分页数据对象。
     */
    public static <T> PaginationResponse<T> makeResponseData(List<T> dataList) {
        // 使用 pageHelper 分页的
        if (dataList instanceof Page) {
            Page<T> pageHelperData = (Page) dataList;
            return new PaginationResponse<>(pageHelperData.getTotal(), pageHelperData.getResult());
        }
        return new PaginationResponse<>((long) dataList.size(), dataList);
    }

    /**
     * 用户构建带有分页信息的数据列表，并且会对结果数据进行处理，如将字典的key转换成value。
     *
     * @param dataList    dataList 数据列表，该参数必须是调用PageMethod.startPage之后，立即执行mybatis查询操作的结果集。
     * @param baseService
     * @param <T>
     * @param <M>
     * @param <V>
     * @return
     */
    public static <T, M, V> PaginationResponse<T> makeResponseData(List<T> dataList, BaseService<?, M, T> baseService) {
        // 使用 pageHelper 分页的
        if (dataList instanceof Page) {
            Page<T> pageHelperData = (Page) dataList;
            baseService.buildGlobalDictForDataList(pageHelperData.getResult(), null);
            return new PaginationResponse<>(pageHelperData.getTotal(), pageHelperData.getResult());
        }
        return new PaginationResponse<>((long) dataList.size(), dataList);
    }

    /**
     * 用户构建带有分页信息的数据列表。
     *
     * @param dataList   数据列表，该参数必须是调用PageMethod.startPage之后，立即执行mybatis查询操作的结果集。
     * @param totalCount 总数量。
     * @return 返回分页数据对象。
     */
    public static <T> PaginationResponse<T> makeResponseData(Long totalCount, List<T> dataList) {
        return new PaginationResponse<>(totalCount, dataList);
    }

    /**
     * 用户构建带有分页信息的数据列表。
     *
     * @param dataList    实体对象数据列表。
     * @param modelMapper 实体对象到DomainVO对象的数据映射器。
     * @param <R>         DomainVO对象类型。
     * @param <V>         DomainVO对象类型。
     * @param <M>         实体对象类型。
     * @return 返回分页数据对象。
     */
    public static <R, V, M> PaginationResponse<V> makeResponseData(List<M> dataList, BaseModelMapper<R, V, M> modelMapper) {
        long totalCount = 0L;
        if (CollectionUtils.isEmpty(dataList)) {
            // 这里需要构建分页数据对象，统一前端数据格式
            return PaginationResponse.emptyPageData();
        }

        if (dataList instanceof Page) {
            Page<M> page = ((Page<M>) dataList);
            return PageUtils.makeResponseData(page.getTotal(), modelMapper.toView(page.getResult()));
        }
        return PageUtils.makeResponseData(totalCount, modelMapper.toView(dataList));
    }

    public static <R, V, M> PaginationResponse<V> makeResponseData(List<M> list, BaseModelMapper<R, V, M> modelMapper, BaseService<?, M, V> baseService) {
        Page<M> page = (Page) list;
        long totalCount = page.getTotal();
        if (CollectionUtils.isEmpty(page.getResult())) {
            // 这里需要构建分页数据对象，统一前端数据格式
            return PaginationResponse.emptyPageData();
        }

        List<V> data = modelMapper.toView(page.getResult());
        baseService.buildGlobalDictForDataList(data, null);
        return PageUtils.makeResponseData(totalCount, data);
    }

    /**
     * 用户构建带有分页信息的数据列表。
     *
     * @param page        实体对象数据列表。
     * @param modelMapper 实体对象到DomainVO对象的数据映射器。
     * @param <R>         DomainVO对象类型。
     * @param <V>         DomainVO对象类型。
     * @param <M>         实体对象类型。
     * @return 返回分页数据对象。
     */
    public static <R, V, M> PaginationResponse<V> makeResponseData(Page<M> page, BaseModelMapper<R, V, M> modelMapper) {
        long totalCount = 0L;
        if (CollectionUtils.isEmpty(page.getResult())) {
            // 这里需要构建分页数据对象，统一前端数据格式
            return PaginationResponse.emptyPageData();
        }
        return PageUtils.makeResponseData(page.getTotal(), modelMapper.toView(page.getResult()));
    }

}
