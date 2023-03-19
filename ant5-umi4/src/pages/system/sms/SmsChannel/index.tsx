import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, message, Modal } from 'antd';
import { useRef, useState } from 'react';
import type {
  ActionType,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import {
  getSmsChannelPageApi,
  deleteSmsChannelApi,
} from '@/services/system/sms/smsChannel';
import { EditChannel } from './EditChannel';
import type {
  SmsChannelPageVO,
  SmsChannelVO,
} from '@/services/system/sms/smsChannel/types';

const SmsChannel: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<SmsChannelVO>>();
  const [modalInfo, setModalInfo] = useState<ModalProps<SmsChannelVO>>();

  const columns: ProColumns<SmsChannelVO, 'dict'>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 100,
      search: false,
    },
    {
      title: '短信签名',
      dataIndex: 'signature',
      width: 150,
    },
    {
      title: '渠道编码',
      dataIndex: 'code',
      width: 180,
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE,
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
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      width: 200,
    },
    {
      title: '短信 API 的账号',
      dataIndex: 'apiKey',
      ellipsis: true,
      width: 200,
    },
    {
      title: '短信 API 的密钥',
      dataIndex: 'apiSecret',
      ellipsis: true,
      width: 200,
    },
    {
      title: '短信发送回调 URL',
      dataIndex: 'callbackUrl',
      ellipsis: true,
      width: 200,
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
              title: '确定删除短信渠道?',
              icon: <ExclamationCircleOutlined />,
              onOk: async () => {
                const resp = await deleteSmsChannelApi(record.id);
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
      <ProTable<SmsChannelVO, SmsChannelPageVO, 'dict'>
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getSmsChannelPageApi}
        columnsState={{
          persistenceKey: 'pro-table-system-smsChannel',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 15,
        }}
        scroll={{ x: 1600 }}
        headerTitle="短信渠道"
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
        <EditChannel
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

export default SmsChannel;
