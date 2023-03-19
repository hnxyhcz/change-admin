import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, message, Modal } from 'antd';
import { useRef, useState } from 'react';

import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { FileQuery, FileVO } from '@/services/infra/file/fileList/types';
import { deleteFileApi, getFilePageApi } from '@/services/infra/file/fileList';
import { UploadFileModal } from './UploadFileModal';
import { formatBytes } from '@/shared/utils';

const FileList: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const [open, openUpload] = useState<boolean>(false);

  const columns: ProColumns<FileVO>[] = [
    {
      title: '文件名',
      dataIndex: 'name',
      ellipsis: true,
      width: 200,
    },
    {
      title: '文件路径',
      dataIndex: 'path',
      ellipsis: true,
      width: 200,
      search: false,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      ellipsis: true,
      hideInSearch: true,
      copyable: true,
      width: 300,
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      width: 120,
      hideInSearch: true,
      renderText: (text) => {
        return formatBytes(text);
      },
    },
    {
      title: '文件类型',
      dataIndex: 'type',
      search: false,
      width: 120,
    },
    {
      title: '上传时间',
      width: 180,
      search: false,
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => [
        <Button
          key="delete"
          size="small"
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => {
            Modal.confirm({
              title: '系统提示',
              content: `是否确认删除文件"${record.path}"?`,
              icon: <ExclamationCircleOutlined />,
              onOk: () => {
                deleteFileApi(record.id).then((res) => {
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
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<FileVO, FileQuery>
        columns={columns}
        actionRef={actionRef}
        bordered
        request={getFilePageApi}
        columnsState={{
          persistenceKey: 'infra-file-list',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        headerTitle="文件列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => openUpload(true)}
          >
            上传
          </Button>,
        ]}
      />
      <UploadFileModal
        open={open}
        onCancel={() => {
          openUpload(false);
        }}
        onOk={() => {
          openUpload(false);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
});

export default FileList;
