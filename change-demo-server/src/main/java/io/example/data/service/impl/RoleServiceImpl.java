package io.example.data.service.impl;

import io.example.core.base.service.BaseService;
import io.example.data.domain.dto.RoleView;
import io.example.data.domain.model.Role;
import io.example.data.mapper.RoleMapper;
import io.example.data.service.RoleService;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl extends BaseService<RoleMapper, Role, RoleView> implements RoleService {

}




