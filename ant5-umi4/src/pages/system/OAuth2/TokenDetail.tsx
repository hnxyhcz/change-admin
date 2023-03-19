import { observer } from '@formily/reactive-react';
import {
  DrawerForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import { useDictStore } from '@/shared/useStore';
import type { OAuth2TokenVO } from '@/services/system/oauth2/token.types';
import { ProFormDict } from '@/components/DictWrapper';

type Props = {
  current?: OAuth2TokenVO;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const TokenDetail: React.FC<Props> = observer((props) => {
  const { onClose, current } = props;
  const { dictMap } = useDictStore();

  return (
    <DrawerForm<OAuth2TokenVO>
      open
      width={800}
      initialValues={current}
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
      <ProFormText name="id" label="编码" readonly />
      <ProFormText name="userId" label="用户编码" readonly />
      <ProFormText name="accessToken" label="访问令牌" readonly />
      <ProFormText name="refreshToken" label="刷新令牌" readonly />
      <ProFormDict
        readonly
        name="userType"
        label="用户类型"
        dictCode={DICT_TYPE.USER}
      />
      <ProFormDateTimePicker name="createTime" label="创建时间" readonly />
      <ProFormDateTimePicker name="expiresTime" label="过期时间" readonly />
    </DrawerForm>
  );
});
