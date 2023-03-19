import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { message, Modal } from 'antd';
import { useRef, useState } from 'react';
import type {
  ActionType,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import {
  getAccessTokenPageApi,
  deleteAccessTokenApi,
} from '@/services/system/oauth2/token';
import { TokenDetail } from './TokenDetail';
import type {
  OAuth2TokenVO,
  OAuth2TokenReqVO,
  OAuth2TokenPageVO,
} from '@/services/system/oauth2/token.types';

const OAuth2Token: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<OAuth2TokenReqVO>>();
  const [modalInfo, setModalInfo] = useState<ModalProps<OAuth2TokenVO>>();

  const columns: ProColumns<OAuth2TokenVO, 'dict'>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 100,
      search: false,
      align: 'center',
    },
    {
      title: '用户编号',
      dataIndex: 'userId',
      width: 150,
      align: 'center',
    },
    {
      title: '访问令牌',
      dataIndex: 'accessToken',
      search: false,
      width: 200,
      align: 'center',
    },
    {
      title: '刷新令牌',
      dataIndex: 'refreshToken',
      search: false,
      width: 200,
      align: 'center',
    },
    {
      title: '用户类型',
      width: 150,
      dataIndex: 'userType',
      align: 'center',
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.USER,
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: 150,
      search: false,
    },
    {
      title: '过期时间',
      dataIndex: 'expiresTime',
      valueType: 'dateTime',
      align: 'center',
      search: false,
      width: 150,
    },
    {
      title: '操作',
      valueType: 'option',
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
          key="logout"
          onClick={() => {
            Modal.confirm({
              title: '确定强制退出?',
              icon: <ExclamationCircleOutlined />,
              onOk: async () => {
                const resp = await deleteAccessTokenApi(record.accessToken);
                if (resp) {
                  message.success('退出成功');
                  actionRef.current?.reload();
                }
              },
            });
          }}
        >
          强退
        </a>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<OAuth2TokenVO, OAuth2TokenPageVO, 'dict'>
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getAccessTokenPageApi}
        columnsState={{
          persistenceKey: 'pro-table-system-smsLog',
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
        headerTitle="令牌管理"
      />
      {modalInfo?.visible && (
        <TokenDetail
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

export default OAuth2Token;
