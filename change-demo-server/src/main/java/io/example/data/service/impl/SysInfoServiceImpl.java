package io.example.data.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import io.example.data.domain.model.SysInfo;
import io.example.data.mapper.SysInfoMapper;
import io.example.data.service.SysInfoService;
import org.springframework.stereotype.Service;

@Service
public class SysInfoServiceImpl extends ServiceImpl<SysInfoMapper, SysInfo>
        implements SysInfoService {

}




