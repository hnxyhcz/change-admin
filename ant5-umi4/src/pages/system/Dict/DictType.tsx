import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, Modal } from 'antd';
import { useRef, useState } from 'react';
import { history } from '@umijs/max';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import {
  deleteDictTypeApi,
  getDictTypePageApi,
} from '@/services/system/dict/dictType';
import { EditDict } from './EditDict';
import type {
  DictTypePageReqVO,
  DictTypeVO,
} from '@/services/system/dict/types';

const DictType: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const [modalInfo, setModalInfo] = useState<ModalProps<DictTypeVO>>();

  const columns: ProColumns<DictTypeVO, 'dict'>[] = [
    {
      title: '字典名称',
      dataIndex: 'name',
      ellipsis: true,
      filters: true,
    },
    {
      title: '字典类型',
      dataIndex: 'type',
      hideInSearch: true,
      render: (text) => <a>{text}</a>,
      onCell: (record) => ({
        onClick: () => {
          history.push(`/system/dict/${record.type}`);
        },
      }),
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.COMMON_STATUS,
      },
    },
    {
      title: '描述',
      dataIndex: 'remark',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      valueType: 'date',
      width: 200,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
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
            编辑
          </a>,
          <a
            key="delete"
            onClick={() => {
              Modal.confirm({
                title: '删除',
                content: '确定删除当前字典?',
                icon: <ExclamationCircleOutlined />,
                onOk: () => {
                  deleteDictTypeApi(record.id).then(() => {
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
      <ProTable<DictTypeVO, DictTypePageReqVO, 'dict'>
        bordered
        columns={columns}
        actionRef={actionRef}
        request={getDictTypePageApi}
        scroll={{ x: 800 }}
        columnsState={{
          persistenceKey: 'system-dict',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        headerTitle="字典类型"
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
        ]}
      />
      {modalInfo?.visible && (
        <EditDict
          onClose={() => {
            setModalInfo(undefined);
          }}
          onOk={() => {
            setModalInfo(undefined);
            actionRef.current?.reload();
          }}
          dict={modalInfo.current}
        />
      )}
    </PageContainer>
  );
});

export default DictType;
