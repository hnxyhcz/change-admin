import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import type {
  ActionType,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';

import { download } from '@/shared/download';
import { DICT_TYPE } from '@/store/DictStore';
import {
  getApiAccessLogPageApi,
  exportApiAccessLogApi,
} from '@/services/infra/apiLog/accessLog';
import { AccessDetail } from './AccessDetail';
import type {
  AccessLogPageVO,
  AccessLogVO,
} from '@/services/infra/apiLog/accessLog/types';

const AccessLog: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<AccessLogVO>>();
  const [modalInfo, setModalInfo] = useState<ModalProps<AccessLogVO>>();

  const columns: ProColumns<AccessLogVO, 'dict'>[] = [
    {
      title: '日志编号',
      dataIndex: 'id',
      width: 100,
      search: false,
      align: 'center',
    },
    {
      title: '用户编号',
      dataIndex: 'userId',
      width: 100,
      align: 'center',
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      width: 100,
      align: 'center',
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.USER,
      },
    },
    {
      title: '应用名',
      dataIndex: 'applicationName',
      width: 150,
      align: 'center',
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
      width: 150,
      align: 'center',
    },
    {
      title: '请求时间',
      dataIndex: 'beginTime',
      valueType: 'dateTime',
      width: 150,
      search: false,
      align: 'center',
    },
    {
      title: '请求时间',
      dataIndex: 'beginTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            beginTime: [`${value[0]} 00:00:00`, `${value[1]} 23:59:59`],
          };
        },
      },
    },
    {
      title: '执行时长',
      dataIndex: 'duration',
      width: 100,
      search: false,
      align: 'center',
    },
    {
      title: '执行结果',
      dataIndex: 'resultCode',
      width: 150,
      align: 'center',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      align: 'center',
      render: (_text, record) => [
        <a
          key="edit"
          onClick={() => {
            setModalInfo({
              current: record,
              visible: true,
            });
          }}
        >
          详情
        </a>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<AccessLogVO, AccessLogPageVO, 'dict'>
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getApiAccessLogPageApi}
        columnsState={{
          persistenceKey: 'pro-table-infra-access-log',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 15,
        }}
        scroll={{ x: 1400 }}
        headerTitle="访问日志"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<DownloadOutlined />}
            type="primary"
            onClick={async () => {
              const params = { ...formRef.current?.getFieldsValue() };
              const res = await exportApiAccessLogApi(params);
              download.excel(res, '访问日志.xlsx');
            }}
          >
            导出
          </Button>,
        ]}
      />
      {modalInfo?.visible && modalInfo.current && (
        <AccessDetail
          onClose={() => {
            setModalInfo(undefined);
          }}
          onOk={() => {
            setModalInfo(undefined);
            actionRef.current?.reload();
          }}
          current={modalInfo.current}
        />
      )}
    </PageContainer>
  );
});

export default AccessLog;
