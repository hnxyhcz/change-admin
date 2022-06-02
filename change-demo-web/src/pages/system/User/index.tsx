import { useSystemStore } from '@/hooks/useSystemStore';
import { updateUser } from '@/services/system';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { observer } from '@formily/reactive-react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { EditUser } from './EditUser';
const tagColor: string[] = ['magenta', 'volcano', 'cyan', 'blue', 'geekblue', 'purple'];

const User: React.FC = observer(() => {
  const systemStore = useSystemStore();

  const actionRef = useRef<ActionType>();
  const passwordRef = useRef<string>();

  const [modalInfo, setModalInfo] = useState<{
    current?: API.SystemUser;
    visible: boolean;
    readonly?: boolean;
  }>();

  useEffect(() => {
    systemStore.loadUsers();
  }, [systemStore]);

  useEffect(() => {
    systemStore.loadPermissions();
  }, [systemStore]);

  const columns: ProColumns<API.SystemUser>[] = [
    {
      title: '组织机构',
      dataIndex: 'lccName',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
      width: 120,
    },
    {
      title: '角色',
      dataIndex: 'role',
      hideInSearch: true,
      width: 150,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record) => (
        <Space>
          {record.roles?.map((x, i) => (
            <Tag key={x.id} color={tagColor[i]}>
              {x.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '手机',
      dataIndex: 'phone',
      width: 150,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      width: 100,
      valueEnum: {
        false: { text: '失活', status: 'Default' },
        true: { text: '激活', status: 'Processing' },
      },
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createAt',
      width: 150,
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            setModalInfo({
              visible: true,
              current: record,
            });
          }}
        >
          编辑
        </a>,
        <Dropdown
          key="action"
          overlay={
            <Menu
              onClick={(e) => {
                const key = e.key;
                if (key === 'resetPwd') {
                  Modal.confirm({
                    title: '重置密码',
                    content: (
                      <Input.Password
                        placeholder="输入密码"
                        onChange={(e) => (passwordRef.current = e.target.value)}
                      />
                    ),
                    okType: 'primary',
                    okText: '修改',
                    onOk: (close) => {
                      if (!passwordRef.current) {
                        message.error('请输入密码');
                        return false;
                      }
                      updateUser({
                        id: record.id,
                        password: passwordRef.current,
                      }).then((r) => {
                        if (r.success) {
                          message.success('修改成功');
                          passwordRef.current = undefined;
                          close();
                        }
                      });
                      return false;
                    },
                  });
                } else if (key === 'delete') {
                  Modal.confirm({
                    title: '删除用户',
                    content: '确定删除当前用户吗？',
                    okType: 'danger',
                    okText: '删除',
                    onOk: () => {
                      systemStore.deleteUser(record.id).then((res) => {
                        if (res.success) {
                          message.success('删除成功');
                          actionRef.current?.reload();
                        }
                      });
                    },
                  });
                }
              }}
              items={[
                {
                  key: 'resetPwd',
                  label: '重置密码',
                },
                {
                  key: 'delete',
                  label: '删除用户',
                },
              ]}
            />
          }
        >
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            更多
            <DownOutlined />
          </a>
        </Dropdown>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<API.SystemUser>
        columns={columns}
        actionRef={actionRef}
        dataSource={systemStore.users}
        request={async (params: API.SystemUserRequest) => {
          return systemStore.loadUsers(params);
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 15,
        }}
        scroll={{ x: 900 }}
        dateFormatter="string"
        headerTitle="系统用户列表"
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
        <EditUser
          onClose={() => {
            setModalInfo(undefined);
          }}
          readonly={modalInfo.readonly}
          onOk={() => {
            setModalInfo(undefined);
            actionRef.current?.reload();
          }}
          user={modalInfo.current}
        />
      )}
    </PageContainer>
  );
});

export default User;
