import React, { useState } from 'react';
import { message, Modal } from 'antd';
import { useModel } from '@umijs/max';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { getContainCharsTotal } from '@/shared/utils';
import { updateUserPwdApi } from '@/services/system/user/profile';

/**
 * 重置密码
 * @returns
 */
const UpdatePassword = () => {
  const { initialState } = useModel('@@initialState');
  const visible = !!initialState?.currentUser?.passwordExpired;

  const formRef = React.useRef<ProFormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(visible);

  return (
    <ModalForm
      title="密码即将过期，请修改密码"
      formRef={formRef}
      width={520}
      visible={modalVisible}
      modalProps={{
        onCancel: () => setModalVisible(false),
        okText: '确认修改',
        maskClosable: false,
      }}
      onFinish={async (values) => {
        const resp = await updateUserPwdApi(
          values.oldPassword,
          values.password,
        );
        if (resp.success) {
          Modal.success({
            content: '密码修改成功，请重新登录',
            okText: '确定',
            onOk: () => {
              initialState?.logout();
              setModalVisible(false);
            },
          });
        } else {
          message.error(resp.message);
        }
      }}
    >
      <ProFormText.Password
        label="旧密码"
        name="oldPassword"
        fieldProps={{
          size: 'large',
        }}
        placeholder={'请输入当前登录密码'}
        rules={[{ required: true, message: '请输入密码！' }]}
      />
      <ProFormText.Password
        name="password"
        label="新密码"
        fieldProps={{
          size: 'large',
        }}
        validateFirst
        placeholder={'请输入密码'}
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
          {
            validator: (_rule, value) => {
              if (value.length < 8) {
                return Promise.reject('密码长度不能小于8位！');
              } else if (getContainCharsTotal(value) < 3) {
                return Promise.reject(
                  '至少包含大写，小写，数字，特殊字符中的三种字符',
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      />
      <ProFormText.Password
        name="confirmPassword"
        label="确认密码"
        fieldProps={{
          size: 'large',
        }}
        placeholder={'请再次输入密码'}
        rules={[
          {
            validator: (_rule, value) => {
              const password = formRef.current?.getFieldValue('password');
              if (!value) {
                return Promise.reject('请再次输入密码');
              } else if (password !== value) {
                return Promise.reject('两次密码输入不一致');
              }
              return Promise.resolve();
            },
          },
        ]}
      />
    </ModalForm>
  );
};

export default UpdatePassword;
