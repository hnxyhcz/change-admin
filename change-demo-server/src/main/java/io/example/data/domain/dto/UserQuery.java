package io.example.data.domain.dto;

import io.example.core.entity.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * @author javahuang
 * @date 2021/10/15
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class UserQuery extends PageQuery {

    private String name;

    private List<String>[] ids;

    private String lccCode;

}
