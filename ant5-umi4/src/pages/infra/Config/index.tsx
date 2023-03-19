import {
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, Modal } from 'antd';
import { useRef, useState } from 'react';
import type {
  ActionType,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';

import { download } from '@/shared/download';
import { DICT_TYPE } from '@/store/DictStore';
import {
  getConfigPageApi,
  deleteConfigApi,
  exportConfigApi,
} from '@/services/infra/config';
import { EditConfig } from './EditConfig';
import type { ConfigPageVO, ConfigVO } from '@/services/infra/config/types';

const Config: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<ConfigVO>>();
  const [modalInfo, setModalInfo] = useState<ModalProps<ConfigVO>>();

  const columns: ProColumns<ConfigVO, 'dict'>[] = [
    {
      title: '配置编号',
      dataIndex: 'id',
      search: false,
      filters: true,
      width: 100,
    },
    {
      title: '配置类别',
      dataIndex: 'category',
      search: false,
      width: 100,
    },
    {
      title: '配置名称',
      dataIndex: 'name',
      width: 150,
      ellipsis: true,
    },
    {
      title: '配置键名',
      dataIndex: 'key',
      width: 200,
      ellipsis: true,
    },
    {
      title: '配置键值',
      dataIndex: 'value',
      width: 150,
      search: false,
    },
    {
      title: '系统内置',
      dataIndex: 'type',
      width: 100,
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.INFRA_CONFIG_TYPE,
      },
    },
    {
      title: '是否敏感',
      dataIndex: 'visible',
      search: false,
      width: 100,
      valueEnum: {
        true: '是',
        false: '否',
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      width: 200,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      width: 150,
      valueType: 'dateTime',
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
      width: 100,
      render: (_, record) => {
        return [
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
                title: '删除',
                content: '确定删除当前配置?',
                icon: <ExclamationCircleOutlined />,
                onOk: () => {
                  deleteConfigApi(record.id).then(() => {
                    actionRef.current?.reload();
                  });
                },
              });
            }}
          >
            删除
          </a>,
        ];
      },
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<ConfigVO, ConfigPageVO, 'dict'>
        bordered
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getConfigPageApi}
        scroll={{ x: 800 }}
        columnsState={{
          persistenceKey: 'infra-config',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        headerTitle="配置管理"
        toolBarRender={() => [
          <Button
            key="button"
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
            key="download"
            icon={<DownloadOutlined />}
            onClick={async () => {
              const params = { ...formRef.current?.getFieldsValue() };
              const res = await exportConfigApi(params);
              download.excel(res, '配置列表.xlsx');
            }}
          >
            导出
          </Button>,
        ]}
      />
      {modalInfo?.visible && (
        <EditConfig
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

export default Config;
