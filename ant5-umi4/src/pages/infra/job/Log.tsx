import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { useSearchParams } from '@umijs/max';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import type {
  ActionType,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import { exportJobLogApi, getJobLogPageApi } from '@/services/infra/job/log';
import { LogDetail } from './LogDetail';
import type { JobLogPageVO, JobLogVO } from '@/services/infra/job/types';
import { DownloadOutlined } from '@ant-design/icons';
import { download } from '@/shared/download';

const DictType: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<JobLogVO>>();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [modalInfo, setModalInfo] = useState<ModalProps<JobLogVO>>();
  const handlerName = searchParams.get('handlerName');

  const columns: ProColumns<JobLogVO, 'dict'>[] = [
    {
      title: '日志编号',
      dataIndex: 'id',
      filters: true,
      width: 100,
      search: false,
    },
    {
      title: '任务编号',
      dataIndex: 'jobId',
      search: false,
      width: 100,
    },
    {
      title: '处理器的名字',
      dataIndex: 'handlerName',
      width: 150,
      formItemProps: {
        initialValue: handlerName,
      },
    },
    {
      title: '处理器的参数',
      dataIndex: 'handlerParam',
      search: false,
      width: 150,
    },
    {
      title: '第几次执行',
      dataIndex: 'executeIndex',
      search: false,
      width: 100,
    },
    {
      title: '开始执行时间',
      dataIndex: 'beginTime',
      valueType: 'dateTime',
      width: 150,
    },
    {
      title: '结束执行时间',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      width: 150,
    },
    {
      title: '执行时长（毫秒）',
      dataIndex: 'duration',
      search: false,
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.INFRA_JOB_LOG_STATUS,
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_, record) => {
        return [
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
        ];
      },
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<JobLogVO, JobLogPageVO, 'dict'>
        bordered
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getJobLogPageApi}
        scroll={{ x: 800 }}
        columnsState={{
          persistenceKey: 'infra-job-log',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        headerTitle="调度日志"
        toolBarRender={() => [
          <Button
            key="download"
            icon={<DownloadOutlined />}
            onClick={async () => {
              const params = { ...formRef.current?.getFieldsValue() };
              const res = await exportJobLogApi(params);
              download.excel(res, '调度日志.xlsx');
            }}
          >
            导出
          </Button>,
        ]}
      />
      {modalInfo?.visible && (
        <LogDetail
          onClose={() => {
            setModalInfo(undefined);
          }}
          onOk={() => {
            setModalInfo(undefined);
            actionRef.current?.reload();
          }}
          log={modalInfo.current}
        />
      )}
    </PageContainer>
  );
});

export default DictType;
