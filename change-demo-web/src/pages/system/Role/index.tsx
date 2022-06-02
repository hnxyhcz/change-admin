import { useSystemStore } from '@/hooks/useSystemStore';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { observer } from '@formily/reactive-react';
import { Button, message, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { EditRole } from './EditRole';

const Role: React.FC = observer(() => {
  const systemStore = useSystemStore();

  const actionRef = useRef<ActionType>();

  const [modalInfo, setModalInfo] = useState<{
    current?: API.Role;
    visible: boolean;
    readonly?: boolean;
  }>();

  useEffect(() => {
    systemStore.loadPermissions();
  }, [systemStore]);

  const columns: ProColumns<API.Role>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 150,
    },
    {
      title: '编码',
      dataIndex: 'code',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'remark',
      search: false,
      width: 200,
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createAt',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 200,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => {
        return [
          <a
            key="readonly"
            onClick={() => {
              setModalInfo({
                visible: true,
                current: record,
                readonly: true,
              });
            }}
          >
            详情
          </a>,
          <TableDropdown
            key="actionGroup"
            onSelect={(key) => {
              if (key === 'edit') {
                setModalInfo({
                  current: record,
                  visible: true,
                });
              }
              if (key === 'delete') {
                if (record.code === 'admin') {
                  message.error('默认管理员角色不能删除');
                  return;
                }
                Modal.confirm({
                  title: '删除',
                  content: '确定删除当前角色?',
                  icon: <ExclamationCircleOutlined />,
                  onOk: () => {
                    systemStore.deleteRole(record.id).then((res) => {
                      if (res.success) {
                        message.success('删除成功');
                        actionRef.current?.reload();
                      }
                    });
                  },
                });
              }
            }}
            menus={[
              { key: 'edit', name: '编辑' },
              { key: 'delete', name: '删除' },
            ]}
          />,
        ];
      },
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<API.Role>
        columns={columns}
        actionRef={actionRef}
        dataSource={systemStore.roles}
        request={async (params: API.RoleRequest) => {
          return systemStore.loadRoles(params);
        }}
        scroll={{ x: 800 }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="系统角色列表"
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
        ]}
      />
      {modalInfo?.visible && (
        <EditRole
          onClose={() => {
            setModalInfo(undefined);
          }}
          readonly={modalInfo.readonly}
          onOk={() => {
            setModalInfo(undefined);
            actionRef.current?.reload();
          }}
          role={modalInfo.current}
        />
      )}
    </PageContainer>
  );
});

export default Role;
