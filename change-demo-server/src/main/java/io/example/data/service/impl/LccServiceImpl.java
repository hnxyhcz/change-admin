package io.example.data.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import io.example.core.base.service.BaseService;
import io.example.core.constant.AppConsts;
import io.example.core.entity.PaginationResponse;
import io.example.core.utils.PageUtils;
import io.example.data.domain.dto.LccQuery;
import io.example.data.domain.dto.LccRequest;
import io.example.data.domain.dto.LccView;
import io.example.data.domain.mapper.LccViewMapper;
import io.example.data.domain.model.Lcc;
import io.example.data.mapper.LccMapper;
import io.example.data.service.LccService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class LccServiceImpl extends BaseService<LccMapper, Lcc, LccView> implements LccService {

    private final LccViewMapper lccViewMapper;

    @Override
    public PaginationResponse<LccView> listLcc(LccQuery query) {
        com.github.pagehelper.PageHelper.startPage(query.getCurrent(), query.getPageSize());
        List<Lcc> lccList = list(Wrappers.<Lcc>lambdaQuery()
                .like(isNotBlank(query.getLccName()), Lcc::getLccName, query.getLccName())
                .eq(isNotBlank(query.getLccCode()), Lcc::getLccCode, query.getLccCode())
                .eq(isNotBlank(query.getAreaCode()), Lcc::getAreaCode, query.getAreaCode())
                .eq(isNotBlank(query.getProvinceCode()), Lcc::getProvinceCode, query.getProvinceCode())
        );
        return PageUtils.makeResponseData(lccList, lccViewMapper, this);
    }

    @Override
    public void createOrUpdateLcc(LccRequest request) {
        if (request.getLccCode() != null) {
            updateById(lccViewMapper.fromRequest(request));
        } else {
            Lcc lcc = lccViewMapper.fromRequest(request);
            lcc.setLccCode(generateLccCode(lcc.getAreaCode(), lcc.getProvinceCode()));
            save(lcc);
        }
    }


    private String generateLccCode(String areaCode, String provinceCode) {
        // 单位名称(固定6)+地区编码(1-7)+协作单位顺序号(同一省份顺序排列两位)
        // 下面这段代码是为了同一省份预留单位编码
        Map<String, String> map = new HashMap<>();
        map.put("11", "00");
        map.put("12", "20");
        map.put("13", "40");
        map.put("14", "60");
        map.put("15", "00");
        map.put("21", "20");
        map.put("22", "40");
        map.put("23", "60");
        map.put("32", "00");
        map.put("33", "10");
        map.put("34", "20");
        map.put("35", "30");
        map.put("36", "40");
        map.put("37", "50");
        map.put("71", "60");
        map.put("31", "70");
        map.put("44", "00");
        map.put("45", "20");
        map.put("46", "40");
        map.put("72", "60");
        map.put("41", "00");
        map.put("42", "20");
        map.put("43", "40");
        map.put("61", "00");
        map.put("62", "20");
        map.put("63", "40");
        map.put("64", "60");
        map.put("65", "80");
        map.put("51", "00");
        map.put("52", "20");
        map.put("53", "40");
        map.put("54", "60");
        map.put("50", "80");
        long totalOfProvince = count(Wrappers.<Lcc>lambdaQuery().eq(Lcc::getProvinceCode, provinceCode));
        String sequence = String.format("%02d", Integer.parseInt(map.get(provinceCode)) + totalOfProvince + 1);
        String lccCode = AppConsts.projectCode + areaCode + sequence;
        return lccCode;
    }
}




