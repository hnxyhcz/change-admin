import { ProFormDependency, ProFormDigit } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { message } from 'antd';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import { ProFormDict } from '@/components/DictWrapper';
import { FileConfigVO } from '@/services/infra/file/filtConfig/types';
import {
  updateFileConfigApi,
  createFileConfigApi,
} from '@/services/infra/file/filtConfig';

type Props = {
  current?: FileConfigVO;
  onClose: () => void;
  onOk: () => void;
};

export const EditConfig: React.FC<Props> = observer((props) => {
  const { onOk, onClose, current } = props;

  const formRef = useRef<ProFormInstance<FileConfigVO>>();

  return (
    <DrawerForm<FileConfigVO>
      title={current?.id ? '修改文件配置' : '添加文件配置'}
      formRef={formRef}
      open
      initialValues={{ status: 0, ...current }}
      drawerProps={{
        onClose,
        forceRender: true,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        let resp;
        if (current?.id) {
          resp = await updateFileConfigApi({ ...current, ...values });
        } else {
          resp = await createFileConfigApi({ ...current, ...values });
        }
        if (resp) {
          message.success(current?.id ? '修改成功' : '新增成功');
          onOk();
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          width="md"
          label="配置名"
          placeholder="请输入配置名"
          required
          rules={[{ required: true, message: '配置名不能为空' }]}
        />
        <ProFormText
          width="md"
          name="remark"
          label="备注"
          placeholder="请输入备注"
        />
        <ProFormDict
          width="md"
          name="storage"
          label="存储器"
          placeholder="请选择存储器"
          dictCode={DICT_TYPE.INFRA_FILE_STORAGE}
          rules={[{ required: true, message: '存储器不能为空' }]}
        />
      </ProForm.Group>

      <ProFormDependency name={['storage']}>
        {({ storage }) => {
          console.log(storage);
          if (storage == '1') {
            //数据库
            return (
              <ProFormText
                name={['config', 'domain']}
                width="md"
                label="自定义域名"
                placeholder="请输入自定义域名"
                required
                rules={[{ required: true, message: '自定义域名不能为空' }]}
              />
            );
          }
          if (storage == '10') {
            // 本地磁盘
            return (
              <ProForm.Group>
                <ProFormText
                  name={['config', 'basePath']}
                  width="md"
                  label="基础路径"
                  placeholder="请输入基础路径"
                  required
                  rules={[{ required: true, message: '基础路径不能为空' }]}
                />
                <ProFormText
                  name={['config', 'domain']}
                  width="md"
                  label="自定义域名"
                  placeholder="请输入自定义域名"
                  required
                  rules={[{ required: true, message: '自定义域名不能为空' }]}
                />
              </ProForm.Group>
            );
          }
          if (storage == '11') {
            //数据库
            return (
              <ProForm.Group>
                <ProFormText
                  name={['config', 'basePath']}
                  width="md"
                  label="基础路径"
                  placeholder="请输入基础路径"
                  required
                  rules={[{ required: true, message: '基础路径不能为空' }]}
                />
                <ProFormText
                  name={['config', 'host']}
                  width="md"
                  label="主机地址"
                  placeholder="请输入主机地址"
                  required
                  rules={[{ required: true, message: '主机地址不能为空' }]}
                />
                <ProFormDigit
                  name={['config', 'port']}
                  width="md"
                  label="主机端口"
                  placeholder="请输入主机端口"
                  required
                  rules={[{ required: true, message: '主机端口不能为空' }]}
                />
                <ProFormText
                  name={['config', 'username']}
                  width="md"
                  label="用户名"
                  placeholder="请输入用户名"
                  required
                  rules={[{ required: true, message: '用户名不能为空' }]}
                />
                <ProFormText
                  name={['config', 'password']}
                  width="md"
                  label="密码"
                  placeholder="请输入密码"
                  required
                  rules={[{ required: true, message: '密码不能为空' }]}
                />
                <ProFormSelect
                  name={['config', 'mode']}
                  options={[
                    {
                      label: '主动模式',
                      value: 'Active',
                    },
                    {
                      label: '被动模式',
                      value: 'Passive',
                    },
                  ]}
                  width="md"
                  label="连接模式"
                  placeholder="请选择连接模式"
                  required
                  rules={[{ required: true, message: '连接模式不能为空' }]}
                />
                <ProFormText
                  name={['config', 'domain']}
                  width="md"
                  label="自定义域名"
                  placeholder="请输入自定义域名"
                  required
                  rules={[{ required: true, message: '自定义域名不能为空' }]}
                />
              </ProForm.Group>
            );
          }
          if (storage == '12') {
            // SFTP
            return (
              <ProForm.Group>
                <ProFormText
                  name={['config', 'basePath']}
                  width="md"
                  label="基础路径"
                  placeholder="请输入基础路径"
                  required
                  rules={[{ required: true, message: '基础路径不能为空' }]}
                />
                <ProFormText
                  name={['config', 'host']}
                  width="md"
                  label="主机地址"
                  placeholder="请输入主机地址"
                  required
                  rules={[{ required: true, message: '主机地址不能为空' }]}
                />
                <ProFormDigit
                  name={['config', 'port']}
                  width="md"
                  label="主机端口"
                  placeholder="请输入主机端口"
                  required
                  rules={[{ required: true, message: '主机端口不能为空' }]}
                />
                <ProFormText
                  name={['config', 'username']}
                  width="md"
                  label="用户名"
                  placeholder="请输入用户名"
                  required
                  rules={[{ required: true, message: '用户名不能为空' }]}
                />
                <ProFormText
                  name={['config', 'password']}
                  width="md"
                  label="密码"
                  placeholder="请输入密码"
                  required
                  rules={[{ required: true, message: '密码不能为空' }]}
                />
                <ProFormText
                  name={['config', 'domain']}
                  width="md"
                  label="自定义域名"
                  placeholder="请输入自定义域名"
                  required
                  rules={[{ required: true, message: '自定义域名不能为空' }]}
                />
              </ProForm.Group>
            );
          }
          if (storage == '20') {
            // S3存储对象
            return (
              <ProForm.Group>
                <ProFormText
                  name={['config', 'endpoint']}
                  width="md"
                  label="节点地址"
                  placeholder="请输入节点地址"
                  required
                  rules={[{ required: true, message: '节点地址不能为空' }]}
                />
                <ProFormText
                  name={['config', 'bucket']}
                  width="md"
                  label="存储 bucket"
                  placeholder="请输入 bucket"
                  required
                  rules={[{ required: true, message: 'bucket不能为空' }]}
                />
                <ProFormText
                  name={['config', 'accessKey']}
                  width="md"
                  label="accessKey"
                  placeholder="请输入accessKey"
                  required
                  rules={[{ required: true, message: 'accessKey不能为空' }]}
                />
                <ProFormText
                  name={['config', 'accessSecret']}
                  width="md"
                  label="accessSecret"
                  placeholder="请输入accessSecret"
                  required
                  rules={[{ required: true, message: 'accessSecret不能为空' }]}
                />
                <ProFormText
                  name={['config', 'domain']}
                  width="md"
                  label="自定义域名"
                  placeholder="请输入自定义域名"
                  required
                  rules={[{ required: true, message: '自定义域名不能为空' }]}
                />
              </ProForm.Group>
            );
          }
          return <></>;
        }}
      </ProFormDependency>
    </DrawerForm>
  );
});
