import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, message, Modal } from 'antd';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

import { handleTree } from '@/shared/tree';
import { IconFont } from '@/components/Icon';
import { DICT_TYPE } from '@/store/DictStore';
import { deleteMenu, getMenuList } from '@/services/system/menu';
import { EditMenu } from './EditMenu';
import type { MenuView } from '@/services/system/menu/types';

const Menu: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const [modalInfo, setModalInfo] = useState<ModalProps<MenuView>>();

  const columns: ProColumns<MenuView, 'dict'>[] = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 200,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 150,
      search: false,
      render: (text) =>
        text && <IconFont type={text.toString()} style={{ fontSize: 16 }} />,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      search: false,
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      width: 200,
      search: false,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      search: false,
      valueType: 'select',
      fieldProps: {
        options: [
          {
            label: '目录',
            value: 1,
          },
          {
            label: '菜单',
            value: 2,
          },
          {
            label: '按钮',
            value: 3,
          },
        ],
      },
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      width: 200,
      search: false,
    },
    {
      title: '菜单状态',
      width: 120,
      dataIndex: 'status',
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.COMMON_STATUS,
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 180,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_text, record) => [
        <a
          key="edit"
          onClick={() => {
            setModalInfo({
              current: record,
              visible: true,
            });
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: '确定删除当前菜单?',
              icon: <ExclamationCircleOutlined />,
              onOk: () => {
                deleteMenu(record.id).then((res) => {
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
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<MenuView, MenuView, 'dict'>
        bordered
        columns={columns}
        actionRef={actionRef}
        request={async (params: MenuView) => {
          const data = await getMenuList(params);
          if (data) {
            return { success: true, data: handleTree(data) };
          }
          return { success: false, data: [] };
        }}
        scroll={{ x: 800 }}
        columnsState={{
          persistenceKey: 'pro-table-system-menu',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={false}
        headerTitle="系统菜单列表"
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
        <EditMenu
          onClose={() => {
            setModalInfo(undefined);
          }}
          onOk={() => {
            setModalInfo(undefined);
            actionRef.current?.reload();
          }}
          menu={modalInfo.current}
        />
      )}
    </PageContainer>
  );
});

export default Menu;
