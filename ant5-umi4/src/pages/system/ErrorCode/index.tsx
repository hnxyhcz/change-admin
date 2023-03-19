import {
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
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
  deleteErrorCodeApi,
  exportErrorCodeApi,
  getErrorCodePageApi,
} from '@/services/system/errorCode';
import { EditErrCode } from './EditErrCode';
import type {
  ErrorCodePageVO,
  ErrorCodeVO,
} from '@/services/system/errorCode/types';

const ErrorCode: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<ErrorCodeVO>>();
  const [modalInfo, setModalInfo] = useState<ModalProps<ErrorCodeVO>>();

  const columns: ProColumns<ErrorCodeVO, 'dict'>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 100,
      search: false,
      align: 'center',
    },
    {
      title: '错误码类型',
      dataIndex: 'type',
      width: 150,
      align: 'center',
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.SYSTEM_ERROR_CODE_TYPE,
      },
    },
    {
      title: '应用名',
      dataIndex: 'applicationName',
      width: 150,
      align: 'center',
    },
    {
      title: '错误码编码',
      dataIndex: 'code',
      width: 150,
      align: 'center',
    },
    {
      title: '错误码错误提示',
      dataIndex: 'message',
      width: 200,
      search: false,
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'memo',
      width: 200,
      search: false,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 150,
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
    {
      title: '操作',
      valueType: 'option',
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
          修改
        </a>,
        <a
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: '确定删除错误码?',
              icon: <ExclamationCircleOutlined />,
              onOk: async () => {
                const resp = await deleteErrorCodeApi(record.id);
                if (resp) {
                  message.success('删除成功');
                  actionRef.current?.reload();
                }
              },
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<ErrorCodeVO, ErrorCodePageVO, 'dict'>
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getErrorCodePageApi}
        columnsState={{
          persistenceKey: 'pro-table-system-errorcode',
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
        headerTitle="错误码列表"
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setModalInfo({
                visible: true,
              });
            }}
          >
            新建
          </Button>,
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={async () => {
              const params = { ...formRef.current?.getFieldsValue() };
              const res = await exportErrorCodeApi(params);
              download.excel(res, '错误编码.xlsx');
            }}
          >
            导出
          </Button>,
        ]}
      />
      {modalInfo?.visible && (
        <EditErrCode
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

export default ErrorCode;
