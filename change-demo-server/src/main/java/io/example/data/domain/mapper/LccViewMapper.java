package io.example.data.domain.mapper;

import java.util.ArrayList;
import java.util.List;

import io.example.core.base.mapper.BaseModelMapper;
import io.example.data.domain.dto.LccRequest;
import io.example.data.domain.dto.LccView;
import io.example.data.domain.model.Lcc;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * @author javahuang
 * @date 2022/5/16
 */
@Mapper
public interface LccViewMapper extends BaseModelMapper<LccRequest, LccView, Lcc> {

    @Mapping(target = "provinceCode", expression = "java(request.getDistinct().get(0))")
    @Mapping(target = "cityCode", expression = "java(request.getDistinct().get(1))")
    @Mapping(target = "countyCode", expression = "java(request.getDistinct().get(2))")
    Lcc fromRequest(LccRequest request);

    LccView toView(Lcc model);

    @AfterMapping
    default void setDistinct(@MappingTarget LccView view) {
        List<String> distinct = new ArrayList<>();
        distinct.add(view.getProvinceCode());
        distinct.add(view.getCityCode());
        distinct.add(view.getCountyCode());
        view.setDistinct(distinct);
    }
}
