package io.example.data.domain.mapper;

import java.util.Arrays;

import io.example.data.domain.dto.RoleRequest;
import io.example.data.domain.dto.RoleView;
import io.example.data.domain.model.Role;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

/**
 * @author javahuang
 * @date 2021/10/12
 */
@Mapper
public interface RoleViewMapper {

	RoleView toView(Role role);

	Role fromRequest(RoleRequest roleRequest);

	@AfterMapping
	default void afterMapping(Role role, @MappingTarget RoleView target) {
		target.setAuthorities(Arrays.asList(role.getAuthority().split(",")));
	}

	@AfterMapping
	default void afterMappingRole(RoleRequest request, @MappingTarget Role target) {
		target.setAuthority(String.join(",", request.getAuthorities()));
	}

}
