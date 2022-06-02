import type { ReactNode } from 'react';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormTextArea } from '@ant-design/pro-form';
import ProForm, { DrawerForm, ProFormText } from '@ant-design/pro-form';
import { observer } from '@formily/reactive-react';
import { useIntl } from 'react-intl';
import { BarsOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { FormTree } from '@/components/Tree';

import { message } from 'antd';
import { useSystemStore } from '@/hooks/useSystemStore';

type Props = {
  role?: API.Role;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export function parseAuthority(authority: string) {
  const authorities = authority.split(':');
  const result: string[] = [];
  for (let i = 0; i < authorities.length; i++) {
    if (i > 0) {
      result.push(`${result[i - 1]}:${authorities[i]}`);
    } else {
      result.push(authorities[0]);
    }
  }
  return result;
}

type TreeType = {
  title: string;
  key: string;
  parentKey?: string;
  icon?: ReactNode;
  children?: TreeType[];
};

// 按照 detail create update delete import export 的方式进行排序
const sort: Record<string, string> = {
  list: '1',
  detail: '2',
  create: '3',
  update: '4',
  delete: '5',
  import: '6',
  export: '7',
};
const nest = (items: TreeType[], key: string | undefined, link: string = 'parentKey'): any => {
  const newItems = items.filter((item) => item[link] === key);
  // 如果权限码里面包含curd，则按照上面的顺序进行排序
  const needSort =
    newItems.filter((x) => Object.keys(sort).includes(x.key.toLowerCase().split(':').slice(-1)[0]))
      .length > 0;
  if (needSort) {
    newItems.sort((a, b) => {
      const aSortK = sort[a.key.toLowerCase().split(':').slice(-1)[0]] || a;
      const bSortK = sort[b.key.toLowerCase().split(':').slice(-1)[0]] || b;
      return aSortK > bSortK ? 1 : aSortK < bSortK ? -1 : 0;
    });
  }
  return newItems.map((item) => ({ ...item, children: nest(items, item.key) }));
};

const ProFormTree = (props: { [x: string]: any }) => {
  const { treeData, flatTreeData, readonly, ...rest } = props;
  return (
    <ProForm.Item {...rest}>
      <FormTree
        treeData={treeData}
        flatTreeData={flatTreeData}
        readonly={readonly}
        {...props.fieldProps}
      />
    </ProForm.Item>
  );
};

export const EditRole: React.FC<Props> = observer((props) => {
  const { onOk, onClose, role, readonly } = props;

  const formRef = useRef<ProFormInstance<API.Role>>();
  const isEdit = !!role?.id;
  const intl = useIntl();
  const systemStore = useSystemStore();

  const tree: TreeType[] = [];

  systemStore.permissions
    .filter((x) => !x.code.startsWith('ROLE_'))
    .forEach((x) => {
      parseAuthority(x.code).forEach((item, i, arr) => {
        const authName =
          x.name ||
          intl.formatMessage({
            id: `authority.${item.replaceAll(':', '.')}`,
            defaultMessage: item,
          });

        if (tree.find((t) => t.key === item)) {
          return;
        }
        const isCurd = Object.keys(sort).includes(item.toLowerCase().split(':').slice(-1)[0]);
        tree.push({
          key: item,
          title: authName,
          icon: isCurd ? <ThunderboltOutlined /> : <BarsOutlined />,
          parentKey: arr[i - 1],
        });
      });
    });

  const treeData = nest(tree, undefined);

  return (
    <DrawerForm<API.Role>
      title={isEdit ? (role?.id ? '修改角色' : '新增角色') : '查看角色'}
      formRef={formRef}
      visible
      initialValues={role}
      submitter={{
        submitButtonProps: {
          style: {
            display: readonly ? 'none' : 'block',
          },
        },
      }}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,

        onClose: () => {
          onClose();
        },
      }}
      onFinish={async (values) => {
        // 不返回不会关闭弹框
        if (role?.code === 'admin' && values.code !== 'admin') {
          message.error('默认管理员角色编码不能修改');
          return;
        }
        const resp = await systemStore.upsertRole({
          ...role,
          ...values,
        });
        if (resp.success) {
          onOk();
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          width="md"
          label="角色名称"
          placeholder="请输入角色名称"
          readonly={readonly}
          required
          rules={[{ required: true, message: '角色名不能为空' }]}
        />
        <ProFormText
          width="md"
          readonly={readonly}
          name="code"
          label="角色编码"
          placeholder="请输入角色编码"
          rules={[{ required: true, message: '角色编码不能为空' }]}
          required
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormTextArea
          name="remark"
          width="xl"
          readonly={readonly}
          label="描述"
          placeholder="请输入角色描述信息"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTree name="authorities" label="角色授权" treeData={treeData} flatTreeData={tree} />
      </ProForm.Group>
    </DrawerForm>
  );
});
