import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, Input, message, Modal, Switch } from 'antd';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

import { DeptTree } from './DeptTree';
import { EditUser } from './EditUser';
import { EditRole } from './EditRole';
import ImportUser from './ImportUser';
import {
  deleteUserApi,
  getUserPageApi,
  resetPasswordApi,
  updateUserStatusApi,
} from '@/services/system/user';
import type { UserPageReqVO, UserVO } from '@/services/system/user/types';

const User: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const passwordRef = useRef<string>();

  const [selectedDept, setSelectDept] = useState<number>();
  const [importVisible, setImportVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState<ModalProps<UserVO>>();
  const [userRoleModal, setUserRoleModal] = useState<ModalProps<UserVO>>();

  const columns: ProColumns<UserVO>[] = [
    {
      title: '用户名称',
      dataIndex: 'username',
      ellipsis: true,
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'nickname',
      ellipsis: true,
      width: 120,
    },
    {
      title: '部门',
      dataIndex: 'deptId',
      hideInSearch: true,
      width: 150,
      render: (_, record) => record.dept?.name,
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      width: 150,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      width: 100,
      render: (_, record) => (
        <Switch
          onChange={(checked) => {
            updateUserStatusApi(record.id, checked ? 0 : 1);
          }}
          defaultChecked={!record.status}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          size="small"
          onClick={() => {
            setModalInfo({
              visible: true,
              current: record,
            });
          }}
        >
          编辑
        </Button>,
        <TableDropdown
          key="actionGroup"
          onSelect={(key: string) => {
            if (key === 'resetPwd') {
              Modal.confirm({
                title: '重置密码',
                content: (
                  <Input.Password
                    placeholder="输入密码"
                    onChange={(e) => (passwordRef.current = e.target.value)}
                  />
                ),
                icon: false,
                okType: 'primary',
                okText: '修改',
                onOk: (close) => {
                  if (!passwordRef.current) {
                    message.error('请输入密码');
                    return false;
                  }
                  resetPasswordApi(record.id, passwordRef.current).then(
                    (res) => {
                      if (res) {
                        message.success('修改成功');
                        passwordRef.current = undefined;
                        close();
                      }
                    },
                  );
                  return false;
                },
              });
            } else if (key === 'delete') {
              Modal.confirm({
                title: '确定删除当前用户吗？',
                okType: 'danger',
                okText: '删除',
                cancelText: '取消',
                onOk: () => {
                  deleteUserApi(record.id).then((res) => {
                    if (res) {
                      message.success('删除成功');
                      actionRef.current?.reload();
                    }
                  });
                },
              });
            } else if (key === 'role') {
              setUserRoleModal({
                visible: true,
                current: record,
              });
            }
          }}
          menus={[
            { key: 'resetPwd', name: '重置密码' },
            { key: 'role', name: '分配角色' },
            { key: 'delete', name: '删除用户' },
          ]}
        >
          更多
        </TableDropdown>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProCard split="vertical">
        <ProCard colSpan="30%">
          <DeptTree onSelect={(val) => setSelectDept(val)} />
        </ProCard>
        <ProCard headerBordered>
          <ProTable<UserVO, UserPageReqVO>
            columns={columns}
            bordered
            actionRef={actionRef}
            params={{ deptId: selectedDept } as UserPageReqVO}
            request={getUserPageApi}
            columnsState={{
              persistenceKey: 'system-user',
              persistenceType: 'localStorage',
            }}
            rowKey="id"
            pagination={{
              defaultPageSize: 10,
            }}
            search={{
              labelWidth: 'auto',
              style: {
                padding: 0,
              },
            }}
            cardProps={{
              bodyStyle: {
                padding: 0,
              },
            }}
            scroll={{ x: 900 }}
            dateFormatter="string"
            headerTitle="系统用户列表"
            toolBarRender={() => [
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
              </Button>,
              <Button
                key="import"
                icon={<UploadOutlined />}
                type="primary"
                onClick={() => {
                  setImportVisible(true);
                }}
              >
                批量导入
              </Button>,
            ]}
          />
        </ProCard>
      </ProCard>
      {modalInfo?.visible && (
        <EditUser
          onClose={() => {
            setModalInfo(undefined);
          }}
          onOk={() => {
            setModalInfo(undefined);
            actionRef.current?.reload();
          }}
          user={modalInfo.current}
        />
      )}
      {userRoleModal?.visible && userRoleModal?.current && (
        <EditRole
          onClose={() => {
            setUserRoleModal(undefined);
          }}
          onOk={() => {
            setUserRoleModal(undefined);
            actionRef.current?.reload();
          }}
          user={userRoleModal.current}
        />
      )}
      {importVisible && (
        <ImportUser
          onCancel={() => setImportVisible(false)}
          onOk={() => {
            setImportVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
});

export default User;
