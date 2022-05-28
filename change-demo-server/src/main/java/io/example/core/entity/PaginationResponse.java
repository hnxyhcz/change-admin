package io.example.core.entity;

import lombok.Data;

import java.util.LinkedList;
import java.util.List;

/**
 * @author javahuang
 * @date 2021/10/6
 */
@Data
public class PaginationResponse<T> {

    private Long total;

    private List<T> data;

    private Integer current;

    private Integer pageSize;

    /**
     * https://procomponents.ant.design/components/table#request
     * protable需要字段
     */
    private Boolean success = true;

    public PaginationResponse(Long total, List<T> data) {
        this.total = total;
        this.data = data;
    }

    /**
     * 为了保持前端的数据格式兼容性，在没有数据的时候，需要返回空分页对象。
     *
     * @return 空分页对象。
     */
    public static <T> PaginationResponse<T> emptyPageData() {
        return new PaginationResponse<>(0L, new LinkedList<>());
    }

}
