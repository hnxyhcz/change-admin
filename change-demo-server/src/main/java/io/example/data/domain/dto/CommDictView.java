package io.example.data.domain.dto;

import lombok.Data;

/**
 * @author javahuang
 * @date 2022/5/13
 */
@Data
public class CommDictView {
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

}
