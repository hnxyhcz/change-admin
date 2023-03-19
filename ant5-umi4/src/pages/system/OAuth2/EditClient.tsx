import {
  DrawerForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { message, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { ProFormDict } from '@/components/DictWrapper';
import { DICT_TYPE } from '@/store/DictStore';
import {
  createOAuth2ClientApi,
  updateOAuth2ClientApi,
} from '@/services/system/oauth2/client';
import type { OAuth2ClientVO } from '@/services/system/oauth2/client.types';

type Props = {
  current?: OAuth2ClientVO;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const EditClient: React.FC<Props> = observer((props) => {
  const { onOk, onClose, current } = props;
  const formRef = useRef<ProFormInstance<OAuth2ClientVO>>();

  const beforeUpload = (file: RcFile) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('不能大于5MB！');
    }
    return isLt5M || Upload.LIST_IGNORE;
  };

  return (
    <DrawerForm<OAuth2ClientVO>
      open
      width={800}
      formRef={formRef}
      initialValues={{
        status: 0,
        accessTokenValiditySeconds: 1800,
        refreshTokenValiditySeconds: 43200,
        ...current,
        logo: current?.logo && [current?.logo],
      }}
      title={`${current?.id ? '修改' : '新增'} OAuth2 客户端`}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose,
      }}
      grid
      rowProps={{ gutter: [16, 0] }}
      onFinish={async (values: OAuth2ClientVO) => {
        debugger;
        values.logo = values?.logo && values?.logo[0];
        let resp;
        if (current?.id) {
          resp = await updateOAuth2ClientApi({ ...current, ...values });
        } else {
          values.logo = 'https://www.iocoder.cn/xx.png';
          resp = await createOAuth2ClientApi(values);
        }
        if (resp) {
          message.success(current?.id ? '修改成功' : '新增成功');
          onOk();
        }
      }}
    >
      <ProFormText
        name="clientId"
        label="客户端编号"
        placeholder="请输入客户端编号"
        rules={[{ required: true, message: '客户端编号不能为空' }]}
      />
      <ProFormText
        name="secret"
        label="客户端密钥"
        placeholder="请输入客户端密钥"
        rules={[{ required: true, message: '客户端密钥不能为空' }]}
      />

      <ProFormText
        name="name"
        label="应用名"
        placeholder="请输入应用名"
        rules={[{ required: true, message: '应用名不能为空' }]}
      />
      <ProFormUploadButton
        label="应用图标"
        name="logo"
        max={1}
        buttonProps={{
          block: true,
        }}
        fieldProps={{
          beforeUpload: beforeUpload,
          customRequest: (options) => {
            // const { onSuccess, onError, file, onProgress } = options;
            // uploadFile({ file, filePath: FilePath.Document }, onProgress).then((res) => {
            //   if (res.success && onSuccess) {
            //     onSuccess(res.data);
            //     message.success('上传成功');
            //   }
            //   if (!res.success && onError) {
            //     onError(new Error('上传失败'));
            //     message.error('上传失败');
            //   }
            // });
          },
        }}
      />

      <ProFormTextArea
        name="description"
        label="应用描述"
        placeholder="请输入应用描述"
      />

      <ProFormDict
        name="status"
        label="状态"
        placeholder="请选择状态"
        dictCode={DICT_TYPE.COMMON_STATUS}
        type="number"
        rules={[{ required: true, message: '请选择状态' }]}
      />

      <ProFormDigit
        name="accessTokenValiditySeconds"
        label="访问令牌的有效期"
        min={0}
        placeholder="请输入数值"
        fieldProps={{ precision: 0 }}
        rules={[{ required: true, message: '访问令牌的有效期不能为空' }]}
      />

      <ProFormDigit
        name="refreshTokenValiditySeconds"
        label="刷新令牌的有效期"
        min={0}
        placeholder="请输入数值"
        fieldProps={{ precision: 0 }}
        rules={[{ required: true, message: '刷新令牌的有效期不能为空' }]}
      />

      <ProFormDict
        name="authorizedGrantTypes"
        label="授权类型"
        placeholder="请选择状态"
        dictCode={DICT_TYPE.SYSTEM_OAUTH2_GRANT_TYPE}
        fieldProps={{
          mode: 'multiple',
        }}
        rules={[{ required: true, message: '授权类型不能为空' }]}
      />

      <ProFormSelect mode="tags" name="scopes" label="授权范围" />

      <ProFormSelect
        mode="tags"
        name="autoApproveScopes"
        label="自动授权范围"
      />

      <ProFormSelect
        mode="tags"
        name="redirectUris"
        label="可重定向的 URI 地址"
        placeholder="请输入可重定向的 URI 地址"
        rules={[{ required: true, message: '可重定向的 URI 地址不能为空' }]}
      />
    </DrawerForm>
  );
});
