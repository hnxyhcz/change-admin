package io.example.data.service;

import com.baomidou.mybatisplus.extension.service.IService;
import io.example.core.entity.PaginationResponse;
import io.example.data.domain.dto.LccQuery;
import io.example.data.domain.dto.LccRequest;
import io.example.data.domain.dto.LccView;
import io.example.data.domain.model.Lcc;

/**
 *
 */
public interface LccService extends IService<Lcc> {

    PaginationResponse<LccView> listLcc(LccQuery query);

    void createOrUpdateLcc(LccRequest request);
}
