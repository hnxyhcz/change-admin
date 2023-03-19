import { ProCard, ProTable } from '@ant-design/pro-components';
import { Col, Descriptions, Row, Tag } from 'antd';
import { useEffect, useState } from 'react';

import { DICT_TYPE } from '@/store/DictStore';
import { useDictStore } from '@/shared/useStore';
import { getCacheApi, getKeyDefineListApi } from '@/services/infra/redis';
import Pie, { PieOption } from '@/components/Charts/Pie';
import Gauge, { GaugeOption } from '@/components/Charts/Gauge';
import type {
  RedisKeyInfo,
  RedisMonitorInfoVO,
} from '@/services/infra/redis/types';

export default (): React.ReactNode => {
  const [loading, setLoading] = useState<boolean>(false);
  const [cache, setCache] = useState<RedisMonitorInfoVO>();
  const [commandOption, setCommandOption] = useState<PieOption>({});
  const [usedMemoryOption, setUsedMemoryOption] = useState<GaugeOption>({});
  const { getDictItem } = useDictStore();

  useEffect(() => {
    loadRedisInfo();
  }, []);

  const loadRedisInfo = async () => {
    setLoading(true);
    const data = await getCacheApi();
    setCache(data);
    loadChartOptions(data);
    setLoading(false);
  };

  const loadChartOptions = (cache: RedisMonitorInfoVO) => {
    const nameList: string[] = [];
    const commandData: { name: string; value: number }[] = [];
    cache.commandStats.forEach((row) => {
      nameList.push(row.command);
      commandData.push({
        name: row.command,
        value: row.calls,
      });
    });
    // 命令统计
    setCommandOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        show: false,
      },
      series: {
        name: '命令',
        type: 'pie',
        radius: [35, 150],
        center: ['50%', '50%'],
        roseType: 'radius',
        data: commandData,
        label: {
          show: true,
        },
        emphasis: {
          label: {
            show: true,
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    });
    // 内存使用情况
    setUsedMemoryOption({
      tooltip: {
        formatter: '{b} <br/>{a} : ' + cache.info.used_memory_human,
      },
      series: [
        {
          name: '峰值',
          type: 'gauge',
          min: 0,
          max: 100,
          radius: '100%',
          detail: {
            formatter: cache.info.used_memory_human,
          },
          axisLabel: {
            color: 'auto',
            fontSize: 16,
          },
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0.2, '#67e0e3'],
                [0.8, '#37a2da'],
                [1, '#fd666d'],
              ],
            },
          },
          pointer: {
            itemStyle: {
              color: 'auto',
            },
          },
          axisTick: {
            distance: -10,
            length: 15,
            lineStyle: {
              width: 1,
              color: 'auto',
            },
          },
          splitLine: {
            distance: -10,
            length: 20,
            lineStyle: {
              width: 1,
              color: 'auto',
            },
          },
          data: [
            {
              value: parseFloat(cache.info.used_memory_human),
              name: '内存消耗',
              title: {
                fontSize: 20,
                offsetCenter: [0, '-35%'],
              },
            },
          ],
        },
      ],
    });
  };

  return (
    <Row gutter={[4, 4]} style={{ margin: 0 }}>
      <Col span={24}>
        <ProCard loading={!!loading} title="基本信息" hoverable bordered>
          <Descriptions column={4}>
            <Descriptions.Item label="Redis版本">
              {cache?.info?.redis_version}
            </Descriptions.Item>
            <Descriptions.Item label="运行模式">
              {cache?.info?.redis_mode == 'standalone' ? '单机' : '集群'}
            </Descriptions.Item>
            <Descriptions.Item label="端口">
              {cache?.info?.tcp_port}
            </Descriptions.Item>
            <Descriptions.Item label="客户端数">
              {cache?.info?.connected_clients}
            </Descriptions.Item>
            <Descriptions.Item label="运行时间(天)">
              {cache?.info?.uptime_in_days}
            </Descriptions.Item>
            <Descriptions.Item label="使用内存">
              {cache?.info?.used_memory_human}
            </Descriptions.Item>
            <Descriptions.Item label="使用CPU">
              {cache?.info
                ? parseFloat(cache?.info?.used_cpu_user_children).toFixed(2)
                : ''}
            </Descriptions.Item>
            <Descriptions.Item label="内存配置">
              {cache?.info?.maxmemory_human}
            </Descriptions.Item>
            <Descriptions.Item label="AOF是否开启">
              {cache?.info?.aof_enabled == '0' ? '否' : '是'}
            </Descriptions.Item>
            <Descriptions.Item label="RDB是否成功">
              {cache?.info?.rdb_last_bgsave_status}
            </Descriptions.Item>
            <Descriptions.Item label="Key数量">
              {cache?.dbSize}
            </Descriptions.Item>
            <Descriptions.Item label="网络入口/出口">
              {`${cache?.info?.instantaneous_input_kbps}kps / ${cache?.info?.instantaneous_output_kbps}kps`}
            </Descriptions.Item>
          </Descriptions>
        </ProCard>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
        <ProCard loading={!!loading} title="命令统计" hoverable bordered>
          <Pie option={commandOption} initOpts={{ height: 350 }} />
        </ProCard>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
        <ProCard loading={!!loading} title="内存信息" hoverable bordered>
          <Gauge option={usedMemoryOption} initOpts={{ height: 350 }} />
        </ProCard>
      </Col>
      <Col span={24}>
        <ProCard hoverable bordered>
          <ProTable<RedisKeyInfo>
            columns={[
              {
                title: 'Key 模板',
                dataIndex: 'keyTemplate',
                search: false,
                width: 150,
              },
              {
                title: 'Key 类型',
                dataIndex: 'keyType',
                width: 100,
                search: false,
              },
              {
                title: 'Value 类型',
                dataIndex: 'valueType',
                width: 200,
                search: false,
              },
              {
                title: '超时时间',
                dataIndex: 'timeoutType',
                width: 150,
                search: false,
                render: (_text, record) => {
                  const item = getDictItem(
                    DICT_TYPE.INFRA_REDIS_TIMEOUT_TYPE,
                    record.timeoutType,
                  );
                  if (item) {
                    return (
                      <>
                        <Tag color={item.colorType} key={item.value}>
                          {item.label}
                        </Tag>
                        {!!record.timeout && (
                          <span>({record.timeout / 1000}秒)</span>
                        )}
                      </>
                    );
                  } else if (!!record.timeout) {
                    return <span>{record.timeout / 1000}秒</span>;
                  }
                },
              },
              {
                title: '备注',
                dataIndex: 'memo',
                width: 150,
                search: false,
              },
            ]}
            request={async () => {
              const data = await getKeyDefineListApi();
              return { data, success: true };
            }}
            rowKey="outUserNo"
            pagination={false}
            toolBarRender={false}
            search={false}
          />
        </ProCard>
      </Col>
    </Row>
  );
};
