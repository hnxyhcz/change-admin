import {
  DownloadOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, Dropdown, Menu, message, Modal, Switch, Tag } from 'antd';
import { useRef, useState } from 'react';
import { history } from '@umijs/max';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import { useDictStore } from '@/shared/useStore';
import {
  deleteJobApi,
  exportJobApi,
  getJobPageApi,
  runJobApi,
  updateJobStatusApi,
} from '@/services/infra/job';
import { EditTask } from './TaskEdit';
import { download } from '@/shared/download';
import type { JobPageVO, JobVO } from '@/services/infra/job/types';

/**
 * 任务状态的枚举
 */
export const InfraJobStatusEnum = {
  INIT: 0, // 初始化中
  NORMAL: 1, // 运行中
  STOP: 2, // 暂停运行
};

const Task: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<JobVO>>();
  const { getDictItem } = useDictStore();
  const [modalInfo, setModalInfo] = useState<ModalProps<JobVO>>();

  const handleChangeStatus = async (row: JobVO) => {
    const operate = row.status === 2 ? '开启' : '关闭';
    Modal.confirm({
      title: `确认要${operate}定时任务编号为${row.id}的数据项?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const status = row.status === 2 ? 1 : 2;
        const resp = await updateJobStatusApi(row.id, status);
        if (resp) {
          message.success(`${operate}成功`);
          actionRef.current?.reload();
        }
      },
    });
  };

  const toTaskLog = (row?: JobVO) => {
    const handlerName = row?.handlerName || '';
    history.push(`/infra/job/log?handlerName=${handlerName}`);
  };

  const columns: ProColumns<JobVO>[] = [
    {
      title: '任务编号',
      dataIndex: 'id',
      ellipsis: true,
      search: false,
      filters: true,
      width: 100,
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => {
        if (record.status === 0) {
          const item = getDictItem(DICT_TYPE.INFRA_JOB_STATUS, record.status);
          return (
            <Tag color={item.colorType} key={item.value}>
              {item.label}
            </Tag>
          );
        }
        return (
          <Switch
            onChange={() => handleChangeStatus(record)}
            checkedChildren="开启"
            unCheckedChildren="暂停"
            checked={record.status !== 2}
          />
        );
      },
    },
    {
      title: '处理器的名字',
      dataIndex: 'handlerName',
      width: 150,
    },
    {
      title: '处理器的参数',
      dataIndex: 'handlerParam',
      search: false,
      width: 150,
    },
    {
      title: 'CRON 表达式',
      dataIndex: 'cronExpression',
      search: false,
      width: 200,
    },
    {
      title: '重试次数',
      dataIndex: 'retryCount',
      search: false,
      width: 100,
    },
    {
      title: '重试间隔',
      dataIndex: 'retryInterval',
      search: false,
      width: 100,
    },
    {
      title: '监控超时时间',
      dataIndex: 'monitorTimeout',
      search: false,
      width: 100,
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
            修改
          </a>,
          <a
            key="delete"
            onClick={() => {
              Modal.confirm({
                title: '删除',
                content: '确定删除当前定时任务?',
                icon: <ExclamationCircleOutlined />,
                onOk: () => {
                  deleteJobApi(record.id).then(() => {
                    actionRef.current?.reload();
                  });
                },
              });
            }}
          >
            删除
          </a>,
          <Dropdown
            overlay={
              <Menu
                items={[
                  {
                    label: '执行一次',
                    key: 'execute',
                  },
                  {
                    label: '任务详细',
                    key: 'detail',
                  },
                  {
                    label: '调度日志',
                    key: 'log',
                  },
                ]}
                onClick={(e) => {
                  const key = e.key;
                  if (key === 'log') {
                    toTaskLog(record);
                  } else if (key === 'detail') {
                    setModalInfo({
                      visible: true,
                      readonly: true,
                      current: record,
                    });
                  } else if (key === 'execute') {
                    Modal.confirm({
                      title: `确认要立即执行一次${record.name}？`,
                      icon: <ExclamationCircleOutlined />,
                      onOk: () => {
                        runJobApi(record.id).then(() => {
                          message.success('执行成功');
                          actionRef.current?.reload();
                        });
                      },
                    });
                  }
                }}
              />
            }
          >
            <a onClick={(e) => e.preventDefault()}>
              更多 <DownOutlined />
            </a>
          </Dropdown>,
        ];
      },
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<JobVO, JobPageVO>
        bordered
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getJobPageApi}
        scroll={{ x: 800 }}
        columnsState={{
          persistenceKey: 'infra-job',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        headerTitle="定时任务"
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
              const res = await exportJobApi(params);
              download.excel(res, '定时任务.xlsx');
            }}
          >
            导出
          </Button>,
          <Button
            key="log"
            icon={<DownloadOutlined />}
            onClick={() => toTaskLog()}
          >
            执行日志
          </Button>,
        ]}
      />
      {modalInfo?.visible && (
        <EditTask
          onClose={() => {
            setModalInfo(undefined);
          }}
          onOk={() => {
            setModalInfo(undefined);
            actionRef.current?.reload();
          }}
          job={modalInfo.current}
          readonly={modalInfo.readonly}
        />
      )}
    </PageContainer>
  );
});

export default Task;
