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
import { useDictStore } from '@/shared/useStore';
import { getSimpleSmsChannels } from '@/services/system/sms/smsChannel';
import {
  getSmsTemplatePageApi,
  deleteSmsTemplateApi,
  exportSmsTemplateApi,
} from '@/services/system/sms/smsTemplate';
import { EditTemplate } from './EditTemplate';
import type { SmsChannelVO } from '@/services/system/sms/smsChannel/types';
import type {
  SmsTemplatePageVO,
  SmsTemplateReqVO,
  SmsTemplateVO,
} from '@/services/system/sms/smsTemplate/types';

const SmsTemplate: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<SmsTemplateReqVO>>();
  const [modalInfo, setModalInfo] = useState<ModalProps<SmsTemplateVO>>();
  const { getDictItem } = useDictStore();

  const columns: ProColumns<SmsTemplateVO, 'dict'>[] = [
    {
      title: '模板编码',
      dataIndex: 'code',
      width: 150,
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      search: false,
      width: 150,
    },
    {
      title: '模板内容',
      dataIndex: 'content',
      search: false,
      width: 200,
    },
    {
      title: '短信类型',
      dataIndex: 'type',
      width: 100,
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE,
      },
    },
    {
      title: '开启状态',
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
      search: false,
      width: 200,
    },
    {
      title: '短信 API 的模板编号',
      dataIndex: 'apiTemplateId',
      width: 200,
    },
    {
      title: '短信渠道',
      dataIndex: 'channelId',
      width: 180,
      valueType: 'select',
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
              title: '确定删除短信模板?',
              icon: <ExclamationCircleOutlined />,
              onOk: async () => {
                const resp = await deleteSmsTemplateApi(record.id);
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
      <ProTable<SmsTemplateVO, SmsTemplatePageVO, 'dict'>
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getSmsTemplatePageApi}
        columnsState={{
          persistenceKey: 'pro-table-system-smsTemplate',
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
        headerTitle="短信模板"
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
              const res = await exportSmsTemplateApi(params);
              download.excel(res, '短信模板.xlsx');
            }}
          >
            导出
          </Button>,
        ]}
      />
      {modalInfo?.visible && (
        <EditTemplate
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

export default SmsTemplate;
