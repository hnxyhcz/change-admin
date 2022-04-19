import React, { useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Badge } from 'antd';

import { PageContainer } from '@ant-design/pro-layout';
import { queryOperationLogs } from '@/services/rms/rbac';

const OperationLog: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.OperationLog>[] = [
    {
      title: '操作名称',
      width: 150,
      align: 'center',
      dataIndex: 'description',
      valueType: 'text',
      fixed: 'left',
    },
    {
      title: '是否成功',
      width: 150,
      align: 'center',
      dataIndex: 'success',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'left',
      render: (s) => {
        if (s) {
          return <Badge status="processing" text="成功" />;
        } else {
          return <Badge status="error" text="失败" />;
        }
      },
    },
    {
      title: '操作人',
      width: 150,
      align: 'center',
      dataIndex: 'operatorName',
      valueType: 'text',
      fixed: 'left',
      hideInSearch: true,
      formItemProps: {},
    },
    {
      title: '操作时间',
      width: 150,
      align: 'center',
      dataIndex: 'operationTime',
      valueType: 'text',
      fixed: 'left',
      hideInForm: true,
      hideInSearch: true,
    },
    // {
    //   title: '操作',
    //   width: 140,
    //   align: 'center',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => (
    //     <>
    //       <a onClick={() => {}}>查看</a>
    //     </>
    //   ),
    // },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<API.OperationLog>
        rowKey="id"
        bordered
        columns={columns}
        actionRef={actionRef}
        headerTitle="操作日志"
        options={{
          fullScreen: true,
        }}
        toolBarRender={false}
        request={(params) => {
          return queryOperationLogs(params);
        }}
        search={{
          labelWidth: 'auto',
        }}
      />
    </PageContainer>
  );
};

export default OperationLog;
