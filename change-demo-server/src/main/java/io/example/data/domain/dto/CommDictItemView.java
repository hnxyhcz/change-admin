package io.example.data.domain.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author javahuang
 * @date 2022/5/16
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommDictItemView {
    private String dictCode;
    private String itemCode;
    private String itemName;

    private List<CommDictItemView> children;
}
