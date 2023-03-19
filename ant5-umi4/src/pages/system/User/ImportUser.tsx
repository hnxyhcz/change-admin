import {
  DownloadOutlined,
  InboxOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { ProFormCheckbox, ProFormItem } from '@ant-design/pro-components';
import { Button, message, Modal, Upload } from 'antd';
import { useState } from 'react';
import type { UploadFile, UploadProps } from 'antd/lib/upload/interface';

import { download } from '@/shared/download';
import {
  importUserTemplateApi,
  uploadUserTemplateApi,
} from '@/services/system/user';

const { Dragger } = Upload;

type Props = {
  onCancel: () => void;
  onOk: () => void;
};

export default function ImportUser(props: Props) {
  const { onCancel, onOk } = props;

  const [loading, setLoading] = useState(false);
  const [updateSupport, setUpdateSupport] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const downloadTemplate = async () => {
    const res = await importUserTemplateApi();
    download.excel(res, '用户导入模版.xlsx');
  };

  const draggerProps: UploadProps = {
    multiple: false,
    accept: '.xls,.xlsx',
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
    maxCount: 1,
  };

  return (
    <Modal
      title="批量导入用户"
      onCancel={onCancel}
      open
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="downloadTemplate"
          icon={<DownloadOutlined />}
          onClick={downloadTemplate}
        >
          下载模板
        </Button>,
        <Button
          key="importTemplate"
          icon={<UploadOutlined />}
          type="primary"
          loading={loading}
          onClick={() => {
            if (fileList.length === 0) {
              message.error('请选择文件');
              return;
            }
            // const { onSuccess, onError, file, onProgress } = options;
            setLoading(true);
            uploadUserTemplateApi({ file: fileList[0], updateSupport }).then(
              (res) => {
                setLoading(false);
                if (res.success) {
                  message.success('导入成功');
                  onOk();
                } else {
                  message.error(res.message);
                }
              },
            );
          }}
        >
          导入
        </Button>,
      ]}
    >
      <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或者拖拽Excel文件到此处</p>
      </Dragger>

      <ProFormItem style={{ margin: '8 0' }}>
        <ProFormCheckbox
          noStyle
          name="updateSupport"
          fieldProps={{
            checked: updateSupport,
            onChange: () => setUpdateSupport(!updateSupport),
          }}
        >
          是否更新已存在的用户数据
        </ProFormCheckbox>
      </ProFormItem>
    </Modal>
  );
}
