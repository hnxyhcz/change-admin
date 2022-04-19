import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, Space, Dropdown, Menu, message, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

import { PageContainer } from '@ant-design/pro-layout';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { ResetPassword } from './ResetPassword';
import { useModel } from 'umi';
import { deleteAccount, saveAccount, queryAccounts } from '@/services/rms/rbac';

const Account: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectRecord, setSelectRecord] = useState<API.Account>();
  const [modalVisible, handleModalVisible] = useState<boolean>(false);

  const [pwdModalProps, setPwdModalProps] = useState<{ visible: boolean; id: string }>();

  const {
    roles = [],
    loadRoles,
    users = [],
    loadUsers,
  } = useModel('rbac', (rbac) => ({
    roles: rbac.roles,
    loadRoles: rbac.loadRoles,
    users: rbac.users,
    loadUsers: rbac.loadUsers,
  }));

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, []);

  const columns: ProColumns<API.Account>[] = [
    {
      title: '用户名',
      width: 150,
      align: 'center',
      dataIndex: 'userId',
      valueType: 'text',
      fixed: 'left',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入姓名',
          },
        ],
      },
      render: (_, r) => {
        return r.name;
      },
      renderFormItem: (item, { type, defaultRender, record, ...rest }, form) => {
        const id = form.getFieldValue('id');
        // 编辑模式下不显示当前字段
        if (id) {
          return null;
        }
        return (
          <Select
            showSearch
            {...rest}
            placeholder="请选择"
            defaultActiveFirstOption={false}
            showArrow={false}
            allowClear
            filterOption={false}
            onSearch={(name) => {
              loadUsers({ name });
            }}
            notFoundContent={null}
          >
            {users.map((user: API.User) => (
              <Select.Option key={user.id} value={user.id}>
                {user.name}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '登录名',
      width: 150,
      align: 'center',
      dataIndex: 'loginName',
      valueType: 'text',
      fixed: 'left',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入姓名',
          },
        ],
      },
    },
    {
      title: '密码',
      width: 150,
      align: 'center',
      dataIndex: 'password',
      valueType: 'password',
      fixed: 'left',
      hideInTable: true,
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入密码',
          },
        ],
      },
      renderFormItem: (item, { type, defaultRender, record, ...rest }, form) => {
        if (type === 'form') {
          const id = form.getFieldValue('id');
          // 编辑模式下不显示当前字段
          if (id) {
            return null;
          }
        }
        return defaultRender(item);
      },
    },
    {
      title: '角色',
      width: 150,
      align: 'center',
      dataIndex: 'roleIds',
      valueType: 'text',
      fixed: 'left',
      render: (_, r) => {
        return r.roleNames?.join(',') || '-';
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择角色',
          },
        ],
      },
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        return (
          <Select
            {...rest}
            mode="multiple"
            placeholder="请选择"
            defaultActiveFirstOption={false}
            showArrow={false}
            allowClear
            filterOption={false}
            notFoundContent={null}
          >
            {roles?.map((role: API.Role) => (
              <Select.Option key={role.id} value={role.id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '状态',
      width: 150,
      align: 'center',
      dataIndex: 'status',
      fixed: 'left',
      formItemProps: {},
      render: (val) => (val === 1 ? '激活' : '失活'),
      valueType: 'text',
      hideInSearch: true,
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        if (type === 'form') {
          return (
            <Select
              {...rest}
              placeholder="请选择"
              defaultActiveFirstOption={false}
              showArrow={false}
              allowClear
              filterOption={false}
              notFoundContent={null}
            >
              <Select.Option value={1}>激活</Select.Option>
              <Select.Option value={2}>失活</Select.Option>
            </Select>
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: '操作',
      width: 140,
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              handleModalVisible(true);
              setSelectRecord(record);
            }}
          >
            编辑
          </a>
          <Dropdown
            overlay={
              <Menu
                onClick={(e) => {
                  console.log(e.key);
                  if (e.key === 'resetPwd') {
                    setPwdModalProps({
                      id: record.id,
                      visible: true,
                    });
                  } else if (e.key === 'delete') {
                    Modal.confirm({
                      title: '删除账户',
                      content: '确定删除当前账户？',
                      onOk: async () => {
                        const resp = await deleteAccount({ id: record.id })
                        if (resp.code === 200) {
                        message.success('删除成功');
                        actionRef.current?.reload();
                        } else {
                        message.error(resp.message || '删除失败');
                        }
                      },
                    });
                  }
                }}
              >
                <Menu.Item key="resetPwd">重置密码</Menu.Item>
                <Menu.Item danger key="delete">
                  删除
                </Menu.Item>
              </Menu>
            }
          >
            <a className="ant-dropdown-link">
              更多 <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<API.Account>
        rowKey="id"
        bordered
        columns={columns}
        actionRef={actionRef}
        headerTitle="账户管理"
        options={{
          fullScreen: true,
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setSelectRecord(undefined);
              handleModalVisible(true);
            }}
          >
            新建
          </Button>,
        ]}
        request={(params) => queryAccounts(params)}
        search={{
          labelWidth: 'auto',
        }}
      />
      <Modal
        destroyOnClose
        visible={modalVisible}
        title={selectRecord?.id ? '修改账户' : '新增账户'}
        onCancel={() => {
          handleModalVisible(false);
          setSelectRecord(undefined);
        }}
        footer={false}
      >
        <ProTable<API.Account, API.Account>
          rowKey="id"
          type="form"
          columns={columns}
          form={{
            labelCol: { span: 4 },
            wrapperCol: { span: 28 },
            layout: 'horizontal',
            initialValues: {
              ...selectRecord,
            },
            submitter: {
              render: (props) => (
                <div style={{ float: 'right' }}>
                  <Button key="rest" onClick={() => props.form?.resetFields()}>重置</Button>
                  <Button
                    type="primary"
                    key="submit"
                    style={{ marginLeft: '8px' }}
                    onClick={() => props.form?.submit?.()}
                  >提交</Button>
                </div>
              ),
            },
          }}
          onSubmit={(value) => {
            saveAccount(selectRecord?.id ? 'PUT' : 'POST', {
              ...value,
              id: selectRecord?.id,
            }).then(resp => {
              if (resp.code === 200) {
                actionRef.current?.reload();
                handleModalVisible(false);
                message.success(value.id ? '修改成功' : '新增成功');
              } else {
                message.error(resp.message || (value.id ? '修改失败' : '新增失败'));
              }
            });
          }}
        />
      </Modal>
      {pwdModalProps?.visible && (
        <ResetPassword
          onCancel={() => {
            setPwdModalProps(undefined)
          }}
          onOk={(password) => {
            saveAccount('PUT', {
              password,
              id: pwdModalProps.id,
            }).then(resp => {
              if (resp.code === 200) {
                setPwdModalProps(undefined);
                message.success('密码修改成功');
              } else {
                message.error(resp.message || '密码修改失败');
              }
            });
          }}
        />
      )}
    </PageContainer>
  );
};

export default Account;
