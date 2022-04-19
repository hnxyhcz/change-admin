import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, TreeSelect, Divider, message, Popconfirm, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { saveRole, queryRoles, deleteRole } from '@/services/rms/rbac';
import { useModel } from 'umi';

const Role: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [selectRecord, setSelectRecord] = useState<API.Role>({});
  const [modalVisible, handleModalVisible] = useState<boolean>(false);

  const { permissions = [], loadPermissions } = useModel('rbac', (rbac) => ({
    permissions: rbac.permissions,
    loadPermissions: rbac.loadPermissions,
  }));

  useEffect(() => {
    loadPermissions();
  }, []);

  const renderPermission = (record: API.Role) => {
    if (record.permissionIds && record.permissionIds.length > 0) {
      return record.permissionIds.map(permId => permissions.find((x: API.Permission) => x.id === permId)?.name).join(",");
    }
    return '无';
  };

  const convertTreeData = () => {
    const treeNodes: any[] = [];
    permissions.forEach((ele: API.Permission) => {
      treeNodes.push({
        id: `${ele.id}`,
        pId: ele.parentId,
        value: `${ele.id}`,
        title: `${ele.name}`,
      });
    });
    return treeNodes;
  };

  const handlePermissionValue = (record: API.Role) => {
    if (record?.permissionIds && record?.permissionIds.length > 0) {
      return record.permissionIds.map(id => ({
        value: id,
        label: permissions.find((x: API.Permission) => x.id === id)?.name,
      }));
    }
    return undefined;
  };

  const columns: ProColumns<API.Role>[] = [
    {
      title: '角色名称',
      width: 100,
      align: 'center',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入角色名称',
          },
        ],
      },
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        if (type === 'form') {
          return <Input {...rest} placeholder="请输入角色名称" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '权限列表',
      width: 400,
      align: 'center',
      dataIndex: 'permissionIds',
      hideInSearch: true,
      render: (_, record) => renderPermission(record),
      renderFormItem: (item, { type, defaultRender }) => {
        if (type === 'form') {
          return (
            <TreeSelect
              placeholder="请为角色分配权限"
              allowClear
              showSearch
              treeCheckable
              treeCheckStrictly
              treeDataSimpleMode
              treeData={convertTreeData()}
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
              setSelectRecord(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除当前记录吗？"
            okText="删除"
            cancelText="取消"
            onConfirm={async () => {
              const resp = await deleteRole({ id: record.id });
              if (resp.code === 200) {
                message.success('删除成功')
                actionRef.current?.reload();
              } else {
                message.error(resp.message || '删除失败');
              }
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<API.Role>
        rowKey="id"
        bordered
        columns={columns}
        actionRef={actionRef}
        toolBarRender={false}
        request={(params) => queryRoles(params)}
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
            <Button
              key="add"
              type="primary"
              onClick={() => {
                handleModalVisible(true);
                setSelectRecord({});
              }}
            >
              <PlusOutlined /> 新建
            </Button>
          ],
        }}
      />
      <Modal
        footer={false}
        destroyOnClose
        visible={modalVisible}
        title={selectRecord.id ? '修改角色' : '新增角色'}
        onCancel={() => {
          handleModalVisible(false);
          setSelectRecord({});
        }}
      >
        <ProTable<
          API.Role,
          Omit<API.Role, 'permissionIds'> & {
            permissionIds: {
              value: string;
              label: string;
            }[];
          }
        >
          rowKey="id"
          type="form"
          columns={columns}
          form={{
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
            initialValues: {
              ...selectRecord,
              permissionIds: handlePermissionValue(selectRecord),
            },
          }}
          onSubmit={async (value) => {
            let permissionIds: string[] = [];
            if (value.permissionIds) {
              permissionIds = value.permissionIds.map((x) => x.value);
            }
            saveRole(selectRecord.id ? 'PUT' : 'POST', {
              role: {
                id: selectRecord.id,
                name: value.name,
              },
              permissionIds,
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
    </PageContainer>
  );
};

export default Role;
