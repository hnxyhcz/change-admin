import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { useAccess, Access } from '@umijs/max';
import { Button, message, Modal, Tag } from 'antd';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

import { handleTree } from '@/shared/tree';
import { deleteDeptApi, getDeptPageApi } from '@/services/system/dept';
import { EditDept } from './EditDept';
import type { DeptListReqVO, DeptVO } from '@/services/system/dept/types';

const Dept: React.FC = observer(() => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [modalInfo, setModalInfo] = useState<ModalProps<DeptVO>>();

  const columns: ProColumns<DeptVO>[] = [
    {
      title: '部门名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 200,
    },
    {
      title: '负责人',
      dataIndex: 'leaderUserId',
      width: 150,
      search: false,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 120,
      search: false,
    },
    {
      title: '状态',
      width: 120,
      dataIndex: 'status',
      render: (text) => (
        <Tag color={text === 0 ? 'processing' : 'error'}>
          {text === 0 ? '开启' : '关闭'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 200,
    },
    {
      title: '操作',
      valueType: 'option',
      hideInTable: !access.hasAnyPermit([
        'system:dept:update',
        'system:dept:delete',
      ]),
      render: (_text, record) => [
        <Access
          key="update"
          accessible={access.hasAnyPermit('system:dept:update')}
        >
          <a
            onClick={() => {
              setModalInfo({
                current: record,
                visible: true,
              });
            }}
          >
            编辑
          </a>
        </Access>,
        <Access
          key="delete"
          accessible={access.hasAnyPermit('system:dept:delete')}
        >
          <a
            onClick={() => {
              Modal.confirm({
                title: '确定删除当前部门?',
                icon: <ExclamationCircleOutlined />,
                onOk: async () => {
                  const resp = await deleteDeptApi(record.id);
                  if (resp) {
                    message.success('删除成功');
                    actionRef.current?.reload();
                  }
                },
              });
            }}
          >
            删除
          </a>
        </Access>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<DeptVO, DeptListReqVO>
        bordered
        columns={columns}
        actionRef={actionRef}
        request={async (params: DeptListReqVO) => {
          const data = await getDeptPageApi(params);
          if (data) {
            return { success: true, data: handleTree(data) };
          }
          return { success: false, data: [] };
        }}
        scroll={{ x: 800 }}
        columnsState={{
          persistenceKey: 'pro-table-system-dept',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={false}
        headerTitle="部门列表"
        toolBarRender={() => [
          <Access accessible={access.hasAnyPermit('system:dept:create')}>
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
            </Button>
          </Access>,
        ]}
      />
      {modalInfo?.visible && (
        <EditDept
          onClose={() => {
            setModalInfo(undefined);
          }}
          onOk={() => {
            setModalInfo(undefined);
            actionRef.current?.reload();
          }}
          dept={modalInfo.current}
        />
      )}
    </PageContainer>
  );
});

export default Dept;
