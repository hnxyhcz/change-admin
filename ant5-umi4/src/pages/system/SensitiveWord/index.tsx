import {
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, message, Modal, Tag } from 'antd';
import { useRef, useState } from 'react';
import type {
  ActionType,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';

import { download } from '@/shared/download';
import { DICT_TYPE } from '@/store/DictStore';
import {
  getSensitiveWordPageApi,
  exportSensitiveWordApi,
  deleteSensitiveWordApi,
} from '@/services/system/sensitiveWord';
import { EditSensitiveWrod } from './EditWord';
import type {
  SensitiveWordPageVO,
  SensitiveWordReqVO,
  SensitiveWordVO,
} from '@/services/system/sensitiveWord/types';

const SensitiveWord: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<SensitiveWordReqVO>>();
  const [modalInfo, setModalInfo] = useState<ModalProps<SensitiveWordVO>>();

  const columns: ProColumns<SensitiveWordVO, 'dict'>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 100,
      search: false,
    },
    {
      title: '敏感词',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 150,
      search: {
        transform: (value) => {
          return {
            tag: value,
          };
        },
      },
      render: (_, record) =>
        record.tags?.map((tag) => <Tag key={tag}>{tag}</Tag>),
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'status',
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.COMMON_STATUS,
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      search: false,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 150,
      search: false,
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
              title: '确定删除敏感词?',
              icon: <ExclamationCircleOutlined />,
              onOk: async () => {
                const resp = await deleteSensitiveWordApi(record.id);
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
      <ProTable<SensitiveWordVO, SensitiveWordPageVO, 'dict'>
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getSensitiveWordPageApi}
        columnsState={{
          persistenceKey: 'pro-table-system-sensitive-word',
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
        headerTitle="敏感词列表"
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
              const res = await exportSensitiveWordApi(params);
              download.excel(res, '敏感词.xlsx');
            }}
          >
            导出
          </Button>,
        ]}
      />
      {modalInfo?.visible && (
        <EditSensitiveWrod
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

export default SensitiveWord;
