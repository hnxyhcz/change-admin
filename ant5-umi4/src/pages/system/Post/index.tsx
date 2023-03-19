import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, message, Modal, Tag } from 'antd';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

import { deletePostApi, getPostPageApi } from '@/services/system/post';
import { EditPost } from './EditPost';
import type { PostPageReqVO, PostVO } from '@/services/system/post/types';

const Position: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const [modalInfo, setModalInfo] = useState<ModalProps<PostVO>>();

  const columns: ProColumns<PostVO>[] = [
    {
      title: '岗位编号',
      dataIndex: 'id',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '岗位编码',
      dataIndex: 'code',
      width: 120,
    },
    {
      title: '岗位名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '显示顺序',
      dataIndex: 'sort',
      search: false,
      width: 100,
    },
    {
      title: '状态',
      width: 100,
      search: false,
      dataIndex: 'status',
      render: (text) => (
        <Tag color={text === 0 ? 'processing' : 'error'}>
          {text === 0 ? '开启' : '关闭'}
        </Tag>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => [
        <a
          key="edit"
          onClick={() => {
            setModalInfo({
              visible: true,
              current: record,
            });
          }}
        >
          编辑
        </a>,
        <a
          key="delte"
          onClick={() => {
            Modal.confirm({
              title: '删除',
              content: '确定删除当前岗位?',
              icon: <ExclamationCircleOutlined />,
              onOk: () => {
                deletePostApi(record.id).then((res) => {
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
      <ProTable<PostVO, PostPageReqVO>
        columns={columns}
        actionRef={actionRef}
        bordered
        request={getPostPageApi}
        columnsState={{
          persistenceKey: 'system-position',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 650 }}
        headerTitle="岗位列表"
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
        <EditPost
          onClose={() => {
            setModalInfo(undefined);
          }}
          onOk={() => {
            setModalInfo(undefined);
            actionRef.current?.reload();
          }}
          position={modalInfo.current}
        />
      )}
    </PageContainer>
  );
});

export default Position;
