import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, message, Modal } from 'antd';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import {
  deleteOAuth2ClientApi,
  getOAuth2ClientPageApi,
} from '@/services/system/oauth2/client';
import type {
  OAuth2ClientPageVO,
  OAuth2ClientVO,
} from '@/services/system/oauth2/client.types';
import { EditClient } from './EditClient';

const OAuth2Cient: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const [modalInfo, setModalInfo] = useState<ModalProps<OAuth2ClientVO>>();

  const columns: ProColumns<OAuth2ClientVO, 'dict'>[] = [
    {
      title: '客户端编号',
      dataIndex: 'clientId',
      search: false,
      width: 100,
    },
    {
      title: '客户端密钥',
      dataIndex: 'secret',
      width: 150,
      search: false,
    },
    {
      title: '应用名',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '应用图标',
      dataIndex: 'logo',
      width: 100,
      render: (_, record) => {
        return record.logo && <img alt="logo" src={record.logo} />;
      },
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
      title: '访问令牌的有效期',
      dataIndex: 'accessTokenValiditySeconds',
      width: 150,
      search: false,
    },
    {
      title: '刷新令牌的有效期',
      dataIndex: 'refreshTokenValiditySeconds',
      width: 150,
      search: false,
    },
    {
      title: '授权类型',
      dataIndex: 'authorizedGrantTypes',
      width: 200,
      search: false,
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.SYSTEM_OAUTH2_GRANT_TYPE,
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 150,
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
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: '确定删除当前 OAuth2 客户端?',
              icon: <ExclamationCircleOutlined />,
              onOk: async () => {
                const resp = await deleteOAuth2ClientApi(record.id);
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
      <ProTable<OAuth2ClientVO, OAuth2ClientPageVO, 'dict'>
        bordered
        columns={columns}
        actionRef={actionRef}
        request={getOAuth2ClientPageApi}
        scroll={{ x: 1000 }}
        columnsState={{
          persistenceKey: 'pro-table-system-oauth2-client',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={false}
        headerTitle="应用管理"
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
        <EditClient
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

export default OAuth2Cient;
