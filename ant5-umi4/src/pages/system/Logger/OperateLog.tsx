import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, Tag } from 'antd';
import { useRef } from 'react';
import type {
  ActionType,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';

import { download } from '@/shared/download';
import { DICT_TYPE } from '@/store/DictStore';
import {
  exportOperateLogApi,
  getOperateLogPageApi,
} from '@/services/system/operatelog';
import type {
  OperateLogPageReqVO,
  OperateLogVO,
} from '@/services/system/operatelog/types';

const OperateLog: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<OperateLogVO>>();

  const columns: ProColumns<OperateLogVO, 'dict'>[] = [
    {
      title: '日志编号',
      dataIndex: 'id',
      width: 100,
      search: false,
      align: 'center',
    },
    {
      title: '操作模块',
      dataIndex: 'module',
      width: 150,
      align: 'center',
    },
    {
      title: '操作名',
      dataIndex: 'name',
      width: 150,
      search: false,
      align: 'center',
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      width: 150,
      align: 'center',
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.SYSTEM_OPERATE_TYPE,
      },
    },
    {
      title: '请求方法名',
      dataIndex: 'requestMethod',
      width: 100,
      search: false,
      align: 'center',
    },
    {
      title: '请求地址',
      dataIndex: 'requestUrl',
      width: 200,
      search: false,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '操作人',
      dataIndex: 'userNickname',
      width: 150,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'success',
      width: 100,
      align: 'center',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            value: true,
            label: '成功',
          },
          {
            value: false,
            label: '失败',
          },
        ],
      },
      render: (_text, { resultCode }) => (
        <Tag color={resultCode === 0 ? 'success' : 'error'}>
          {resultCode === 0 ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '操作时间',
      dataIndex: 'startTime',
      valueType: 'dateTime',
      width: 150,
      search: false,
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'startTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: [`${value[0]} 00:00:00`, `${value[1]} 23:59:59`],
          };
        },
      },
    },
    {
      title: '操作时长',
      dataIndex: 'duration',
      width: 100,
      search: false,
      align: 'center',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      align: 'center',
      render: (_text, record) => [
        <a key="edit" onClick={() => {}}>
          详情
        </a>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<OperateLogVO, OperateLogPageReqVO, 'dict'>
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getOperateLogPageApi}
        columnsState={{
          persistenceKey: 'pro-table-system-operatelog',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 15,
        }}
        scroll={{
          x: 1800,
        }}
        headerTitle="操作日志"
        toolBarRender={() => [
          <Button
            key="export"
            icon={<DownloadOutlined />}
            type="primary"
            onClick={async () => {
              const params = { ...formRef.current?.getFieldsValue() };
              const res = await exportOperateLogApi(params);
              download.excel(res, '操作日志.xlsx');
            }}
          >
            导出
          </Button>,
        ]}
      />
    </PageContainer>
  );
});

export default OperateLog;
