import {
  DrawerForm,
  ProFormDateTimePicker,
  ProFormText,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { AccessLogVO } from '@/services/infra/apiLog/accessLog/types';

type Props = {
  current: AccessLogVO;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const AccessDetail: React.FC<Props> = observer((props) => {
  const { onClose, current } = props;
  const formRef = useRef<ProFormInstance<AccessLogVO>>();

  return (
    <DrawerForm<AccessLogVO>
      open
      width={800}
      formRef={formRef}
      initialValues={{
        ...current,
        userInfo: `${current.userId} | ${current.userIp} | ${current.userAgent}`,
        requestInfo: `${current.requestMethod} | ${current.requestUrl}`,
      }}
      title={'详情'}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose,
      }}
      layout={'inline'}
      grid
      rowProps={{ gutter: [16, 0] }}
    >
      <ProFormText name="id" label="日志主键" readonly />
      <ProFormText name="applicationName" label="应用名" readonly />
      <ProFormText name="userInfo" label="用户信息" readonly />
      <ProFormText name="requestInfo" label="请求信息" readonly />
      <ProFormText name="requestParams" label="请求参数" readonly />
      <ProFormDateTimePicker name="beginTime" label="开始时间" readonly />
      <ProFormDateTimePicker name="endTime" label="结束时间" readonly />
      <ProFormText name="resultCode" label="执行结果" readonly />
    </DrawerForm>
  );
});
