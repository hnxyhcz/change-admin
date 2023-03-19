import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, message, Modal } from 'antd';
import { useRef, useState } from 'react';
import type {
  ActionType,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';

import { download } from '@/shared/download';
import { DICT_TYPE } from '@/store/DictStore';
import {
  getApiErrorLogPageApi,
  exportApiErrorLogApi,
  updateApiErrorLogPageApi,
} from '@/services/infra/apiLog/errorLog';
import { ErrorDetail } from './ErrorDetail';
import type {
  ErrorLogPageVO,
  ErrorLogVO,
} from '@/services/infra/apiLog/errorLog/types';

const ErrorLog: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<ErrorLogVO>>();
  const [modalInfo, setModalInfo] = useState<ModalProps<ErrorLogVO>>();

  const columns: ProColumns<ErrorLogVO, 'dict'>[] = [
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
      width: 200,
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
      width: 200,
      align: 'center',
    },
    {
      title: '异常发送时间',
      dataIndex: 'exceptionTime',
      valueType: 'dateTime',
      width: 150,
      search: false,
      align: 'center',
    },
    {
      title: '异常发送时间',
      dataIndex: 'exceptionTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            exceptionTime: [`${value[0]} 00:00:00`, `${value[1]} 23:59:59`],
          };
        },
      },
    },
    {
      title: '异常名',
      dataIndex: 'exceptionName',
      width: 200,
      search: false,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '处理状态',
      dataIndex: 'processStatus',
      width: 150,
      align: 'center',
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.INFRA_API_ERROR_LOG_PROCESS_STATUS,
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      align: 'center',
      fixed: 'right',
      render: (_text, record) => [
        <a
          key="detail"
          onClick={() => {
            setModalInfo({
              current: record,
              visible: true,
            });
          }}
        >
          详情
        </a>,
        <a
          key="processed"
          onClick={() => {
            Modal.confirm({
              title: '确定标记为已处理?',
              icon: <ExclamationCircleOutlined />,
              onOk: async () => {
                const resp = await updateApiErrorLogPageApi(record.id, 1);
                if (resp) {
                  message.success('操作成功');
                  actionRef.current?.reload();
                }
              },
            });
          }}
        >
          已处理
        </a>,
        <a
          key="ignored"
          onClick={() => {
            Modal.confirm({
              title: '确定标记为已忽略?',
              icon: <ExclamationCircleOutlined />,
              onOk: async () => {
                const resp = await updateApiErrorLogPageApi(record.id, 2);
                if (resp) {
                  message.success('操作成功');
                  actionRef.current?.reload();
                }
              },
            });
          }}
        >
          已忽略
        </a>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<ErrorLogVO, ErrorLogPageVO, 'dict'>
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getApiErrorLogPageApi}
        columnsState={{
          persistenceKey: 'pro-table-infra-error-log',
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
        headerTitle="错误日志"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<DownloadOutlined />}
            type="primary"
            onClick={async () => {
              const params = { ...formRef.current?.getFieldsValue() };
              const res = await exportApiErrorLogApi(params);
              download.excel(res, '错误日志.xlsx');
            }}
          >
            导出
          </Button>,
        ]}
      />
      {modalInfo?.visible && modalInfo.current && (
        <ErrorDetail
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

export default ErrorLog;
