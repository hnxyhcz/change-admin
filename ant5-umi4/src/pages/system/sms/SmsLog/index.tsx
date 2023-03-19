import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, Tag } from 'antd';
import { useRef, useState } from 'react';
import moment from 'moment';
import type {
  ActionType,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';

import { download } from '@/shared/download';
import { DICT_TYPE } from '@/store/DictStore';
import { useDictStore } from '@/shared/useStore';
import { getSimpleSmsChannels } from '@/services/system/sms/smsChannel';
import {
  getSmsLogPageApi,
  exportSmsLogApi,
} from '@/services/system/sms/smsLog';
import { Detail } from './Detail';
import type { SmsChannelVO } from '@/services/system/sms/smsChannel/types';
import type {
  SmsLogPageVO,
  SmsLogReqVO,
  SmsLogVO,
} from '@/services/system/sms/smsLog/types';

const SmsLog: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<SmsLogReqVO>>();
  const [modalInfo, setModalInfo] = useState<ModalProps<SmsLogVO>>();

  const { getDictItem } = useDictStore();

  const columns: ProColumns<SmsLogVO, 'dict'>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 100,
      search: false,
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
      title: '手机号',
      dataIndex: 'mobile',
      width: 150,
      align: 'center',
    },
    {
      title: '短信内容',
      dataIndex: 'templateContent',
      search: false,
      width: 200,
      align: 'center',
    },
    {
      title: '发送状态',
      width: 150,
      dataIndex: 'sendStatus',
      align: 'center',
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.SYSTEM_SMS_SEND_STATUS,
      },
      render: (text, record) => {
        const item = getDictItem(
          DICT_TYPE.SYSTEM_SMS_SEND_STATUS,
          record.sendStatus,
        );
        let statusText = text;
        if (item) {
          statusText = (
            <Tag color={item.colorType} key={item.value}>
              {item.label}
            </Tag>
          );
        }
        return (
          <span>
            {statusText}
            <br />
            {moment(record.sendTime).format('YYYY-MM-DD hh:mm:ss')}
          </span>
        );
      },
    },
    {
      title: '接收状态',
      dataIndex: 'receiveStatus',
      width: 100,
      align: 'center',
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.SYSTEM_SMS_RECEIVE_STATUS,
      },
    },
    {
      title: '短信渠道',
      dataIndex: 'channelId',
      width: 180,
      valueType: 'select',
      align: 'center',
      request: async () => {
        const data = (await getSimpleSmsChannels()) || [];
        return data.map(({ id, code, signature }: SmsChannelVO) => {
          const channel = getDictItem(DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE, code);
          return { label: `${signature}【${channel.label}】`, value: id };
        });
      },
      fieldProps: {
        fieldNames: {
          value: 'value',
          label: 'label',
        },
      },
    },
    {
      title: '模板编号',
      dataIndex: 'templateId',
      align: 'center',
      width: 180,
    },
    {
      title: '短信类型',
      dataIndex: 'templateType',
      width: 100,
      align: 'center',
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE,
      },
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      valueType: 'dateRange',
      hideInTable: true,
      align: 'center',
      search: {
        transform: (value) => {
          return {
            sendTime: [`${value[0]} 00:00:00`, `${value[1]} 23:59:59`],
          };
        },
      },
    },
    {
      title: '接收时间',
      dataIndex: 'receiveTime',
      valueType: 'dateRange',
      hideInTable: true,
      align: 'center',
      search: {
        transform: (value) => {
          return {
            receiveTime: [`${value[0]} 00:00:00`, `${value[1]} 23:59:59`],
          };
        },
      },
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
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<SmsLogVO, SmsLogPageVO, 'dict'>
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getSmsLogPageApi}
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
        headerTitle="短信日志"
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={async () => {
              const params = { ...formRef.current?.getFieldsValue() };
              const res = await exportSmsLogApi(params);
              download.excel(res, '短信日志.xlsx');
            }}
          >
            导出
          </Button>,
        ]}
      />
      {modalInfo?.visible && modalInfo.current && (
        <Detail
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

export default SmsLog;
