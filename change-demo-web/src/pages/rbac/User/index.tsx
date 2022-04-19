import React, { useState, useRef, useEffect } from 'react';
import { FormInstance, Modal } from 'antd';
import { Button, Input, Divider, TreeSelect, message, Popconfirm } from 'antd';

import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { checkUsername, deleteUser, queryUsers, saveUser } from '@/services/rms/rbac';
import { SEX } from '@/utils/dict';

const User: React.FC = () => {
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const [selectRecord, handleSelectRecord] = useState<API.User>();
  const [modalVisible, handleModalVisible] = useState<boolean>(false);

  const { roles = [], loadRoles } = useModel('rbac', (rbac) => ({
    roles: rbac.roles,
    loadRoles: rbac.loadRoles,
  }));

  useEffect(() => {
    loadRoles();
  }, []);

  const convertRoleData = () => {
    const roleList = roles || [];
    const treeNodes: any[] = [];
    roleList.forEach((ele: API.TreeNode) => {
      treeNodes.push({
        value: `${ele.id}`,
        title: `${ele.name}`,
      });
    });
    return treeNodes;
  };

  const validateLoginName = (_rule: any, value: any, callback: any) => {
    if ((selectRecord?.id && selectRecord.username !== value) || !selectRecord?.id && value) {
      checkUsername({ username: value }).then((resp) => {
        if (resp.code === 200) {
          callback();
        } else {
          callback('用户名已存在');
        }
      });
    } else {
      callback()
    }
  }

  const handleRoleValue = (record?: API.User) => {
    if (record?.roleIds && record?.roleIds.length > 0) {
      return record.roleIds.map((id) => ({
        value: id,
        label: roles?.data?.find((x: API.Role) => x.id === id)?.name,
      }));
    }
    return undefined;
  }

  const renderRoles = (record: API.User) => {
    if (record.roleIds && record.roleIds.length > 0) {
      return record.roleIds
        .map((roleId) => roles?.find((x: API.Role) => x.id === roleId)?.name)
        .join(',');
    }
    return '-';
  }

  const columns: ProColumns<API.User>[] = [
    {
      title: '姓名',
      width: 80,
      align: 'center',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入姓名',
          },
        ],
      },
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        if (type === 'form') {
          return <Input {...rest} placeholder="请输入姓名" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '登录名',
      width: 100,
      align: 'center',
      dataIndex: 'username',
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '登录名不能为空',
          },
          {
            validator: validateLoginName,
            validateTrigger: 'onBlur',
          },
        ],
      },
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        if (type === 'form') {
          return <Input {...rest} placeholder="请输入登录名" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '密码',
      width: 100,
      align: 'center',
      dataIndex: 'password',
      hideInTable: true,
      hideInSearch: true,
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        if (type === 'form') {
          return (
            <Input.Password
              {...rest}
              placeholder={!!selectRecord?.id ? '请输入新密码' : '请输入密码'}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: '手机号',
      width: 100,
      align: 'center',
      dataIndex: 'mobile',
      valueType: 'text',
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入手机号',
          },
          {
            pattern: /^1\d{10}$/,
            message: '请填写有效的手机号',
          },
        ],
      },
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        if (type === 'form') {
          return <Input {...rest} placeholder="请输入手机号" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '邮箱',
      width: 100,
      align: 'center',
      dataIndex: 'email',
      hideInSearch: true,
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            type: 'email',
            message: '请输入有效的邮箱',
          },
        ],
      },
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        if (type === 'form') {
          return <Input {...rest} placeholder="请输入邮箱" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      hideInSearch: true,
      align: 'center',
      width: 50,
      valueType: 'select',
      fieldProps: {
        options: SEX.map(({ label, value }) => ({
          label,
          value: `${value}`
        })),
      },
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        return defaultRender(item);
      },
    },
    {
      title: '角色',
      width: 100,
      align: 'center',
      hideInSearch: true,
      dataIndex: 'roleIds',
      render: (_, record) => renderRoles(record),
      renderFormItem: (item, { type, defaultRender }) => {
        if (type === 'form') {
          return (
            <TreeSelect
              placeholder="请为用户分配角色"
              allowClear
              showSearch
              treeCheckable
              treeCheckStrictly
              treeData={convertRoleData()}
              style={{ width: '100%' }}
              dropdownStyle={{ overflow: 'auto' }}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: '操作',
      width: 80,
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleModalVisible(true);
              handleSelectRecord(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除该用户?"
            onConfirm={() => {
              if (record.id) {
                deleteUser({ id: record.id }).then((resp) => {
                  if (resp.code === 200) {
                    actionRef.current?.reload();
                    message.success('删除成功');
                  } else {
                    message.error('删除失败');
                  }
                });
              }
            }}
            okText="是"
            cancelText="否"
            placement="left"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<API.User>
        rowKey="id"
        bordered
        columns={columns}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              handleModalVisible(true);
              handleSelectRecord(undefined);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params) => queryUsers(params)}
        search={{
          optionRender: ({ searchText, resetText }, { form }) => [
            <Button
              key="search"
              type="primary"
              onClick={() => {
                form?.submit();
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="rest"
              onClick={() => {
                form?.resetFields();
                form?.submit();
              }}
            >
              {resetText}
            </Button>,
          ],
        }}
      />
      <Modal
        footer={false}
        destroyOnClose
        visible={modalVisible}
        title={selectRecord ? '修改用户' : '新增用户'}
        onCancel={() => {
          handleModalVisible(false);
          handleSelectRecord(undefined);
        }}
      >
        <ProTable<
          API.User,
          Omit<API.User, 'roleIds'> & {
            roleIds: {
              value: string;
              label: string;
            }[];
          }
        >
          rowKey="id"
          type="form"
          formRef={formRef}
          columns={columns}
          form={{
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            initialValues: {
              ...selectRecord,
              roleIds: handleRoleValue(selectRecord),
            },
          }}
          onSubmit={async (value) => {
            const { roleIds = [], ...user } = value;
            saveUser(selectRecord?.id ? 'PUT' : 'POST', {
              ...user,
              id: selectRecord?.id,
            }).then((resp) => {
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
    </PageContainer>
  );
};

export default User;
