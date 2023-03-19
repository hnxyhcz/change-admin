import {
  DrawerForm,
  ProFormDateTimePicker,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import { useDictStore } from '@/shared/useStore';
import type { ErrorLogVO } from '@/services/infra/apiLog/errorLog/types';
import { ProFormDict } from '@/components/DictWrapper';

type Props = {
  current: ErrorLogVO;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const ErrorDetail: React.FC<Props> = observer((props) => {
  const { onClose, current } = props;
  const { getDictItem } = useDictStore();
  const formRef = useRef<ProFormInstance<ErrorLogVO>>();

  return (
    <DrawerForm<ErrorLogVO>
      open
      width={800}
      formRef={formRef}
      initialValues={{
        ...current,
        userInfo: `${current.userId} | ${
          getDictItem(DICT_TYPE.USER, current.userType).label
        } | ${current.userIp} | ${current.userAgent}`,
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
      <ProFormDateTimePicker name="exceptionTime" label="异常时间" readonly />
      <ProFormText name="exceptionName" label="异常名" readonly />
      <ProFormTextArea name="exceptionStackTrace" label="异常信息" readonly />
      <ProFormDict
        readonly
        name="processStatus"
        label="处理状态"
        dictCode={DICT_TYPE.INFRA_API_ERROR_LOG_PROCESS_STATUS}
      />
    </DrawerForm>
  );
});
