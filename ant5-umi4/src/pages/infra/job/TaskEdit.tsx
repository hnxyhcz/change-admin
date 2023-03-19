import {
  DrawerForm,
  ProFormDigit,
  ProFormText,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { useRef } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-components';

import { createJobApi, updateJobApi } from '@/services/infra/job';
import type { JobVO } from '@/services/infra/job/types';

type Props = {
  job?: Partial<JobVO>;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const EditTask: React.FC<Props> = observer((props) => {
  const { onOk, onClose, job, readonly = false } = props;

  const formRef = useRef<ProFormInstance<JobVO>>();
  const isEdit = !!job?.id;

  return (
    <DrawerForm<JobVO>
      title={readonly ? '详情' : isEdit ? '修改任务' : '添加任务'}
      formRef={formRef}
      visible
      initialValues={{
        status: 0,
        ...job,
      }}
      drawerProps={{
        onClose,
        forceRender: true,
        destroyOnClose: true,
      }}
      grid
      rowProps={{ gutter: [16, 0] }}
      onFinish={async (values) => {
        if (readonly) {
          onOk();
          return;
        }
        let resp;
        if (job?.id) {
          resp = await updateJobApi({
            ...job,
            ...values,
          });
        } else {
          resp = await createJobApi({
            ...job,
            ...values,
          });
        }
        if (resp.code === 0) {
          onOk();
        } else {
          message.error(resp.msg);
        }
      }}
    >
      <ProFormText
        name="name"
        label="任务名称"
        readonly={readonly}
        placeholder="请输入任务名称"
        rules={[{ required: true, message: '任务名称不能为空' }]}
      />
      <ProFormText
        name="handlerName"
        label="处理器的名字"
        readonly={readonly}
        placeholder="请输入处理器的名字"
        rules={[{ required: true, message: '处理器的名字不能为空' }]}
      />
      <ProFormText
        name="handlerParam"
        label="处理器的参数"
        readonly={readonly}
        placeholder="请输入处理器的参数"
      />
      <ProFormText
        name="cronExpression"
        label="CRON表达式"
        readonly={readonly}
        placeholder="请输入CRON表达式"
        rules={[{ required: true, message: 'CRON表达式不能为空' }]}
      />
      <ProFormDigit
        name="retryCount"
        label="重试次数"
        min={0}
        readonly={readonly}
        placeholder="请输入重试次数，设置为0时，不进行重试"
        fieldProps={{ precision: 0 }}
        rules={[{ required: true, message: '重试次数不能为空' }]}
      />
      <ProFormDigit
        name="retryInterval"
        label="重试间隔"
        min={0}
        readonly={readonly}
        tooltip="单位：毫秒"
        placeholder="请输入重试间隔，设置为0时，不进行重试"
        fieldProps={{ precision: 0 }}
        rules={[{ required: true, message: '重试间隔不能为空' }]}
      />
      <ProFormDigit
        name="monitorTimeout"
        label="监控超时时间"
        min={0}
        readonly={readonly}
        tooltip="单位：毫秒"
        placeholder="请输入监控超时时间，单位：毫秒"
        fieldProps={{ precision: 0 }}
      />
    </DrawerForm>
  );
});
