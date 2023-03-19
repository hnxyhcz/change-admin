import { uploadFileApi } from '@/services/infra/file/fileList';
import { InboxOutlined } from '@ant-design/icons';
import { message, Modal, Upload, UploadFile, UploadProps } from 'antd';
import { useState } from 'react';

const { Dragger } = Upload;

type Props = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
};

export const UploadFileModal = (props: Props) => {
  const { open, onCancel, onOk } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const draggerProps: UploadProps = {
    multiple: false,
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
      onOk={async () => {
        if (fileList.length > 0) {
          const resp = await uploadFileApi({
            path: fileList[0].originFileObj?.name,
            file: fileList[0],
          });
          if (resp) {
            message.success('上传成功');
            setFileList([]);
            onOk();
          }
        }
      }}
      onCancel={onCancel}
      okText="上传"
      title="上传文件"
      open={open}
    >
      <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">将文件拖到此处或者点击上传</p>
        <p className="ant-upload-hint">
          提示：仅允许导入 jpg、png、gif 格式文件！
        </p>
      </Dragger>
    </Modal>
  );
};
