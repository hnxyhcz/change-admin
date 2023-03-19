import {
  CloudUploadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Button, message, Modal, Tag } from 'antd';
import { useRef, useState } from 'react';
import type { ActionType } from '@ant-design/pro-components';

import {
  deleteFileConfigApi,
  getFileConfigPageApi,
  testFileConfigApi,
  updateFileConfigMasterApi,
} from '@/services/infra/file/filtConfig';
import { DICT_TYPE } from '@/store/DictStore';
import { EditConfig } from './EditConfig';
import type {
  FileConfigReqVO,
  FileConfigVO,
} from '@/services/infra/file/filtConfig/types';

const FileConfig: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const [modalInfo, setModalInfo] = useState<ModalProps<FileConfigVO>>();

  const columns: ProColumns<FileConfigVO, 'dict'>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '配置名',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '存储器',
      dataIndex: 'storage',
      width: 150,
      fieldProps: {
        dictCode: DICT_TYPE.INFRA_FILE_STORAGE,
      },
      valueType: 'dict',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
      width: 150,
    },
    {
      title: '主配置',
      dataIndex: 'master',
      search: false,
      width: 100,
      renderText(text, record, index, action) {
        if (text) {
          return <Tag color="success">是</Tag>;
        } else {
          return <Tag>否</Tag>;
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      valueType: 'dateTime',
      width: 200,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => [
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
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
        <Button
          key="master"
          type="link"
          icon={record.master ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          size="small"
          disabled={record.master}
          onClick={() => {
            Modal.confirm({
              title: '系统提示',
              content: `是否修改配置 ${record.name} 为主配置？`,
              icon: <ExclamationCircleOutlined />,
              onOk: () => {
                updateFileConfigMasterApi(record.id)
                  .then((res) => {
                    if (res) {
                      message.success('修改成功');
                      actionRef.current?.reload();
                    }
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              },
            });
          }}
        >
          主配置
        </Button>,
        <Button
          key="test"
          type="link"
          icon={<CloudUploadOutlined />}
          size="small"
          onClick={() => {
            testFileConfigApi(record.id).then((res) => {
              Modal.info({
                title: '系统提示',
                content: `测试通过，上传文件成功！访问地址：${res} `,
              });
            });
          }}
        >
          测试
        </Button>,
        <Button
          size="small"
          key="delete"
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => {
            Modal.confirm({
              title: '系统提示',
              content: `是否确定删除文件配置 ${record.name}？`,
              icon: <ExclamationCircleOutlined />,
              onOk: () => {
                deleteFileConfigApi(record.id).then((res) => {
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
      <ProTable<FileConfigVO, FileConfigReqVO, 'dict'>
        columns={columns}
        actionRef={actionRef}
        bordered
        request={getFileConfigPageApi}
        columnsState={{
          persistenceKey: 'infra-file-config',
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
        headerTitle="文件配置"
        toolBarRender={() => [
          <Button
            key="button"
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
        <EditConfig
          onClose={() => {
            setModalInfo(undefined);
          }}
          onOk={() => {
            setModalInfo(undefined);
            actionRef.current?.reload();
          }}
          current={modalInfo.current}
        />
      )}
    </PageContainer>
  );
});

export default FileConfig;
