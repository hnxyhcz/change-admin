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
import {
  exportLoginLogApi,
  getLoginLogPageApi,
} from '@/services/system/loginlog';
import type {
  LoginLogPageReqVO,
  LoginLogVO,
} from '@/services/system/loginlog/types';
import { DICT_TYPE } from '@/store/DictStore';

const LoginLog: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<LoginLogVO>>();

  const columns: ProColumns<LoginLogVO, 'dict'>[] = [
    {
      title: '日志编号',
      dataIndex: 'id',
      width: 100,
      search: false,
      align: 'center',
    },
    {
      title: '日志类型',
      dataIndex: 'logType',
      width: 150,
      search: false,
      align: 'center',
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.SYSTEM_LOGIN_TYPE,
      },
    },
    {
      title: '用户名称',
      dataIndex: 'username',
      width: 150,
      align: 'center',
    },
    {
      title: '登录地址',
      dataIndex: 'userIp',
      width: 100,
      align: 'center',
    },
    {
      title: 'userAgent',
      dataIndex: 'userAgent',
      width: 150,
      search: false,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '登陆结果',
      dataIndex: 'result',
      width: 100,
      align: 'center',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            value: 0,
            label: '成功',
          },
          {
            value: 1,
            label: '失败',
          },
        ],
      },
      search: {
        transform: (value) => ({ status: value === 0 }),
      },
      render: (_text, { result }) => (
        <Tag color={result === 0 ? 'success' : 'error'}>
          {result === 0 ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 100,
      search: false,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            createTime: [`${value[0]} 00:00:00`, `${value[1]} 23:59:59`],
          };
        },
      },
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<LoginLogVO, LoginLogPageReqVO, 'dict'>
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getLoginLogPageApi}
        columnsState={{
          persistenceKey: 'pro-table-system-loginlog',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 15,
        }}
        headerTitle="登录日志"
        toolBarRender={() => [
          <Button
            key="create"
            icon={<DownloadOutlined />}
            type="primary"
            onClick={async () => {
              const params = { ...formRef.current?.getFieldsValue() };
              const res = await exportLoginLogApi(params);
              download.excel(res, '登录日志.xlsx');
            }}
          >
            导出
          </Button>,
        ]}
      />
    </PageContainer>
  );
});

export default LoginLog;
