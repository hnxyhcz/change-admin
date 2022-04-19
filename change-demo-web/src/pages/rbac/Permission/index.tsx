import React, { useState, useEffect } from 'react';
import { Dropdown, Modal } from 'antd';
import type { FormInstance } from 'antd';
import { Row, Col, Button, Card, Form, Tree, Menu as AntMenu, Spin, message } from 'antd';
import ProForm, { ProFormSelect, ProFormTextArea, ProFormText } from '@ant-design/pro-form';
import type { DataNode, EventDataNode } from 'antd/lib/tree';
import { PageContainer } from '@ant-design/pro-layout';
import arrToTree from 'array-to-tree';
import { deletePermission, savePermission, sortPermission } from '@/services/rms/rbac';
import { useModel } from 'umi';

import styles from '../styles.less'
import { PermissionItem } from '../data';

const { DirectoryTree } = Tree;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const Permission: React.FC = () => {
  const formRef: React.MutableRefObject<any> = React.createRef<FormInstance>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);

  const { loading, permissions = [], loadPermissions } = useModel('rbac', (rbac) => ({
    loading: rbac.loading,
    permissions: rbac.permissions,
    loadPermissions: rbac.loadPermissions,
  }));

  useEffect(() => {
    loadPermissions();
  }, []);

  const onDrop = async (info: {
    event: React.MouseEvent;
    node: EventDataNode & any;
    dragNode: EventDataNode & any;
    dragNodesKeys: React.Key[];
    dropPosition: number;
    dropToGap: boolean;
  }) => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const dropItem = permissions.filter((el: API.Permission) => el.id === dragKey)[0];
    const dragItem = permissions.filter((el: API.Permission) => el.id === dropKey)[0];
    if (dropItem.parentId !== dragItem.parentId || dropPosition === 0) {
      message.error('只能在同一级移动调换顺序');
    } else if (dropItem === dragItem) {
      message.error('顺序未发生变化');
    } else {
      sortPermission({ dragKey, dropKey, dropPosition }).then(resp => {
        if (resp.code === 200) {
          message.success('操作成功');
          loadPermissions();
        } else {
          message.success('操作失败');
        }
      });
    }
  };

  const getParentName = (parentId: string | undefined) => {
    if (parentId) {
      return permissions.find((x: API.Permission) => x.id === parentId)?.name || null;
    }
    return null;
  };

  // 添加权限
  const onAdd = (item: PermissionItem) => {
    formRef.current?.resetFields();
    formRef.current?.setFieldsValue({
      parentId: item && item.id,
      parentName: getParentName(item.id),
      permissionLevel: item && (item.permissionLevel || 0) + 1,
    });
  };

  // 修改权限
  const onEdit = (item: PermissionItem) => {
    formRef.current?.resetFields();
    formRef.current?.setFieldsValue({
      ...item,
      parentName: getParentName(item.parentId),
    });
  };

  // 删除
  const onDelete = (item: PermissionItem) => {
    if (item.children && item.children.length > 0) {
      message.error('请先删除子权限');
      return;
    }
    if (item.id) {
      deletePermission({ id: item.id }).then(resp => {
        if (resp.code === 200) {
          message.success('删除成功');
          loadPermissions();
        } else {
          message.error(resp.message || '删除失败');
        }
      });
    }
  };

  // 修改or新增
  const handleSave = (values: API.Permission) => {
    const resetFields = formRef?.current?.resetFields;
    savePermission(values.id ? 'PUT' : 'POST', values).then(resp => {
      if (resp.code === 200) {
        loadPermissions()
        message.success('操作成功')
        if (resetFields) {
          resetFields();
        }
      } else {
        message.error(resp.message || '操作失败')
      }
    });
  };

  const handleClick = (key: string, item: PermissionItem,) => {
    if (key === "update") {
      onEdit(item);
    }
    if (key === "add") {
      onAdd(item);
    }
    if (key === "delete") {
      Modal.confirm({
        title: "删除菜单",
        content: "确定删除当前菜单吗?",
        onOk() {
          onDelete(item);
        }
      })
    }
  }

  const renderMenu = (item: PermissionItem) => (
    <AntMenu onClick={e => handleClick(e.key, item)}>
      <AntMenu.Item key="update">
        修改
      </AntMenu.Item>
      <AntMenu.Item key="delete">
        删除
      </AntMenu.Item>
      <AntMenu.Item key="add">
        添加子权限
      </AntMenu.Item>
    </AntMenu>
  );

  const renderTreeData = (data: PermissionItem[]) => {
    const treeData: DataNode[] = data.map((item) => {
      const title = (
        <Dropdown overlay={renderMenu(item)} trigger={['contextMenu']}>
          <span>{item.name}</span>
        </Dropdown>
      );
      if (item.children) {
        const children = renderTreeData(item.children);
        return { key: item.id || '', title, children, className: styles.treeNode }
      }
      return { key: item.id || '', title, className: styles.treeNode }
    });
    return treeData;
  };

  return (
    <PageContainer title={false}>
      <Card style={{ minHeight: 'calc(100vh - 190px)' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col sm={24} md={6}>
            <Spin spinning={loading}>
              <DirectoryTree
                draggable
                blockNode
                autoExpandParent={autoExpandParent}
                expandedKeys={expandedKeys}
                onDrop={onDrop}
                onExpand={(keys: React.Key[]) => {
                  setExpandedKeys(keys);
                  setAutoExpandParent(false);
                }}
                treeData={renderTreeData(
                  arrToTree(permissions, {
                    customID: 'id',
                    parentProperty: 'parentId',
                  })
                )}
              />
            </Spin>
          </Col>
          <Col sm={24} md={12}>
            <ProForm
              layout="horizontal"
              formRef={formRef}
              omitNil={false}
              submitter={false}
              onFinish={async (values) => {
                handleSave(values);
              }}
              {...formItemLayout}
            >
              <ProFormText hidden name="id" />
              <ProFormText hidden name="parentId" />
              <ProFormText hidden name="permissionLevel" />
              <ProFormText
                name="name"
                label="名称"
                placeholder="请填写名称"
                rules={[
                  {
                    required: true,
                    message: '名称不能为空！',
                  },
                ]}
              />
              <ProFormText
                name="code"
                label="权限码"
                placeholder="请填写权限码"
                rules={[
                  {
                    required: true,
                    message: '权限码不能为空！',
                  },
                ]}
              />
              <ProFormText
                name="parentName"
                label="父权限"
                disabled
                placeholder=""
              />
              <ProFormSelect
                name="permissionType"
                label="类型"
                placeholder="请选择类型"
                options={[
                  { label: '菜单', value: 1 },
                  { label: '功能', value: 2 },
                ]}
                rules={[
                  {
                    required: true,
                    message: '类型不能为空！',
                  },
                ]}
              />
              <ProFormTextArea
                name="remark"
                label="备注"
                placeholder=""
              />
              <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  提交
                </Button>
                <Button key="reset" style={{ marginLeft: '16px' }} onClick={() => formRef?.current?.resetFields()}>
                  重置
                </Button>
              </Form.Item>
            </ProForm>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Permission;
