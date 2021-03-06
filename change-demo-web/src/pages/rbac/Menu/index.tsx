import React, { useEffect, useState } from 'react';
import arrToTree from 'array-to-tree';
import { PageContainer } from '@ant-design/pro-layout';
import { Dropdown, Modal } from 'antd';
import type { FormInstance } from "antd";
import { Row, Col, Button, Card, Form, Tree, TreeSelect, Menu as AntMenu, Spin, message } from 'antd';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PictureOutlined } from '@ant-design/icons';
import type { DataNode, EventDataNode } from 'antd/lib/tree';

import type { MenuItem, TreeNodeItem } from '../data';
import styles from '../styles.less'
import { useModel } from 'umi';
import { deleteMenu, saveMenu, sortMenus } from '@/services/rms/rbac';

const { DirectoryTree } = Tree;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const Menu: React.FC = () => {
  const formRef: React.MutableRefObject<any> = React.createRef<FormInstance>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);

  const { menus = [], loading, permissions = [], loadMenus, loadPermissions } = useModel('rbac', (rbac) => ({
    menus: rbac.menus,
    loading: rbac.loading,
    loadMenus: rbac.loadMenus,
    permissions: rbac.permissions,
    loadPermissions: rbac.loadPermissions,
  }));

  useEffect(() => {
    loadMenus();
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
    const dropItem = menus.filter((el: MenuItem) => el.id === dragKey)[0];
    const dragItem = menus.filter((el: MenuItem) => el.id === dropKey)[0];
    if (dropItem?.parentId !== dragItem?.parentId || dropPosition === 0) {
      message.error('????????????????????????????????????');
    } else if (dropItem === dragItem) {
      message.error('?????????????????????');
    } else {
      sortMenus({ dragKey, dropKey, dropPosition }).then(resp => {
        if (resp.code === 200) {
          message.success('????????????');
          loadMenus();
        } else {
          message.error(resp.message || '????????????');
        }
      });
    }
  };

  const getParentName = (parentId: string | undefined) => {
    if (parentId) {
      return menus.find((x: MenuItem) => x.id === parentId)?.name || null;
    }
    return null;
  };

  // ????????????
  const onAdd = (item: MenuItem) => {
    formRef.current?.resetFields();
    formRef.current?.setFieldsValue({
      parentId: item && item.id,
      parentName: getParentName(item.id),
      menuLevel: item && (item.menuLevel || 0) + 1,
    });
  };

  // ????????????
  const onEdit = (item: MenuItem) => {
    formRef.current?.resetFields()
    formRef.current?.setFieldsValue({
      ...item,
      parentName: getParentName(item.parentId),
    });
  };

  const onDelete = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      message.error('?????????????????????');
      return;
    }
    if (item.id) {
      deleteMenu({ id: item.id }).then(resp => {
        if (resp.code === 200) {
          message.success("????????????");
          loadMenus();
        } else {
          message.error(resp.message || '????????????');
        }
      });
    }
  };

  const handleSave = (values: API.Menu) => {
    const resetFields = formRef.current?.resetFields;
    saveMenu(values.id ? 'PUT' : 'POST', values).then(resp => {
      if (resp.code === 200) {
        loadMenus()
        message.success('????????????')
        if (resetFields) {
          resetFields();
        }
      } else {
        message.error('????????????')
      }
    });
  };

  const handleClick = (key: string, item: MenuItem) => {
    if (key === "update") {
      onEdit(item);
    }
    if (key === "add") {
      onAdd(item);
    }
    if (key === "delete") {
      Modal.confirm({
        title: "????????????",
        content: "????????????????????????????",
        onOk() {
          onDelete(item);
        }
      })
    }
  }

  const renderMenu = (item: MenuItem) => (
    <AntMenu onClick={e => handleClick(e.key, item)}>
      <AntMenu.Item key="update">
        ??????
      </AntMenu.Item>
      <AntMenu.Item key="delete">
        ??????
      </AntMenu.Item>
      <AntMenu.Item key="add">
        ???????????????
      </AntMenu.Item>
    </AntMenu>
  );


  const renderTreeData = (data: MenuItem[]) => {
    const treeData: DataNode[] = data.map((item: MenuItem) => {
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

  const convert = (): TreeNodeItem[] => {
    const treeNodes: TreeNodeItem[] = [];
    permissions?.filter((ele: API.Permission) => ele.permissionType === 1)
      .forEach((ele: API.Permission) => {
        treeNodes.push({
          value: `${ele.id}`,
          title: `${ele.name}`,
          key: `${ele.id}`,
          parentId: ele.parentId,
        });
      });
    return treeNodes;
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
                  arrToTree(menus, {
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
              <ProFormText hidden name="menuLevel" />
              <ProFormText
                name="name"
                label="??????"
                placeholder="???????????????"
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ]}
              />
              <ProFormText
                name="parentName"
                label="?????????"
                disabled
                placeholder=""
              />
              <ProFormSelect
                name="hideInMenu"
                label="????????????"
                placeholder="?????????"
                options={[
                  { label: '???', value: 1 },
                  { label: '???', value: 0 },
                ]}
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ]}
              />
              <ProFormSelect
                name="hideInBreadcrumb"
                label="???????????????"
                placeholder="?????????"
                options={[
                  { label: '???', value: 1 },
                  { label: '???', value: 0 },
                ]}
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ]}
              />
              <ProFormText
                name="path"
                label="????????????"
                placeholder="????????????????????????"
                rules={[
                  {
                    required: true,
                    message: '???????????????????????????',
                  },
                ]}
              />
              <ProFormText
                name="icon"
                label="??????"
                placeholder="??????????????????..."
                fieldProps={{
                  suffix: (
                    <PictureOutlined
                      onClick={() => window.open('https://ant.design/components/icon-cn/')}
                    />
                  )
                }}
              />
              <Form.Item
                label="????????????"
                name="permissionId"
                rules={[{ required: true, message: '??????????????????!' }]}
                {...formItemLayout}
              >
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="?????????"
                  allowClear
                  treeData={arrToTree(convert(), {
                    parentProperty: 'parentId',
                    customID: 'value',
                  })}
                />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  ??????
                </Button>
                <Button key="reset" style={{ marginLeft: '16px' }} onClick={() => formRef?.current?.resetFields()}>
                  ??????
                </Button>
              </Form.Item>
            </ProForm>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
}

export default Menu;
