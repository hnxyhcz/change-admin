package io.example.data.domain.dto;

import io.example.core.entity.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author javahuang
 * @date 2022/5/16
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class LccQuery extends PageQuery {
    private String areaCode;
    private Integer joinResearch;
    private String lccName;
    private String provinceCode;
    private String lccCode;
}
