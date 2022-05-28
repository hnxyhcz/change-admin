package io.example.data.domain.dto;

import lombok.Data;

/**
 * @author javahuang
 * @date 2022/5/16
 */
@Data
public class CommDictItemRequest {
    private String id;
    private String dictCode;
    private String itemCode;
    private String itemName;
    private String parentItemCode;
}
