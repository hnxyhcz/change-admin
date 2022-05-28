package io.example.data.domain.dto;

import java.util.List;

import lombok.Data;

/**
 * @author javahuang
 * @date 2022/5/13
 */
@Data
public class CommDictRequest {
    /**
     * 主键Id
     */
    private String id;

    /**
     * 字典编码
     */
    private String dictCode;

    /**
     * 字典中文名称
     */
    private String dictName;

    /**
     * 字典列表
     */
    private List<CommDictItemRequest> items;


}
