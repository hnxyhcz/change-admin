import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, message, Modal } from 'antd';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import { deleteRoleApi, getRolePageApi } from '@/services/system/role';
import { EditRole } from './EditRole';
import { EditRule } from './EditRule';
import type { RoleVO, RoleReqVO } from '@/services/system/role/types';

const Role: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const [modalInfo, setModalInfo] = useState<ModalProps<RoleVO>>();

  const [ruleModal, setRuleModal] = useState<{
    type: '数据权限' | '菜单权限';
    current: RoleVO;
    visible: boolean;
  }>();

  const columns: ProColumns<RoleVO, 'dict'>[] = [
    {
      title: '角色编号',
      dataIndex: 'id',
      ellipsis: true,
      width: 150,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 150,
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '角色类型',
      dataIndex: 'type',
      width: 150,
      hideInForm: true,
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.SYSTEM_ROLE_TYPE,
      },
    },
    {
      title: '显示顺序',
      dataIndex: 'sort',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '描述',
      dataIndex: 'remark',
      search: false,
      hideInTable: true,
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
      width: 200,
      render: (text, record) => {
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
            key="menu"
            onClick={() => {
              setRuleModal({
                type: '菜单权限',
                visible: true,
                current: record,
              });
            }}
          >
            菜单权限
          </a>,
          <a
            key="data"
            onClick={() => {
              setRuleModal({
                type: '数据权限',
                visible: true,
                current: record,
              });
            }}
          >
            数据权限
          </a>,
          <a
            key="delete"
            onClick={() => {
              if (record.code === 'super_admin') {
                message.error('内置角色不能删除');
                return;
              }
              Modal.confirm({
                title: '删除',
                content: '确定删除当前角色?',
                icon: <ExclamationCircleOutlined />,
                onOk: () => {
                  deleteRoleApi(record.id).then((res) => {
                    if (res) {
                      message.success('删除成功');
                      actionRef.current?.reload();
                    }
                  });
                },
              });
            }}
          >
            删除
          </a>,
        ];
      },
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<RoleVO, RoleReqVO, 'dict'>
        columns={columns}
        bordered
        actionRef={actionRef}
        request={getRolePageApi}
        scroll={{ x: 800 }}
        columnsState={{
          persistenceKey: 'system-role',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        headerTitle="系统角色列表"
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
        ]}
      />
      {modalInfo?.visible && (
        <EditRole
          onClose={() => {
            setModalInfo(undefined);
          }}
          onOk={() => {
            setModalInfo(undefined);
            actionRef.current?.reload();
          }}
          role={modalInfo.current}
        />
      )}
      {ruleModal?.visible && (
        <EditRule
          onClose={() => {
            setRuleModal(undefined);
          }}
          onOk={() => {
            setRuleModal(undefined);
            actionRef.current?.reload();
          }}
          role={ruleModal.current}
          type={ruleModal.type}
        />
      )}
    </PageContainer>
  );
});

export default Role;
