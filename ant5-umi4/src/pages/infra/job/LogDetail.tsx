import {
  DrawerForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import { ProFormDict } from '@/components/DictWrapper';
import type { JobLogVO } from '@/services/infra/job/types';

type Props = {
  log?: Partial<JobLogVO>;
  onClose: () => void;
  onOk: () => void;
};

export const LogDetail: React.FC<Props> = observer((props) => {
  const { onClose, log } = props;
  const formRef = useRef<ProFormInstance<JobLogVO>>();

  return (
    <DrawerForm<JobLogVO>
      title={'详情'}
      formRef={formRef}
      visible
      initialValues={{
        status: 0,
        ...log,
      }}
      drawerProps={{
        onClose,
        forceRender: true,
        destroyOnClose: true,
      }}
      grid
      rowProps={{ gutter: [16, 0] }}
    >
      <ProFormText name="jobId" label="任务编号" readonly />
      <ProFormText name="handlerName" label="处理器的名字" readonly />
      <ProFormText name="handlerParam" label="处理器的参数" readonly />
      <ProFormText name="executeIndex" label="第几次执行" readonly />
      <ProFormDateTimePicker name="beginTime" label="开始执行时间" readonly />
      <ProFormDateTimePicker name="endTime" label="结束执行时间" readonly />
      <ProFormText name="duration" label="执行时长" readonly />
      <ProFormDict
        readonly
        name="status"
        label="状态"
        type="number"
        dictCode={DICT_TYPE.INFRA_JOB_LOG_STATUS}
      />
    </DrawerForm>
  );
});
