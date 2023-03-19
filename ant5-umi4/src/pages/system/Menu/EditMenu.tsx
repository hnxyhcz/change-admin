import {
  ProForm,
  DrawerForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { CloseOutlined } from '@ant-design/icons';
import { observer } from '@formily/reactive-react';
import { Input, message } from 'antd';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { handleTree } from '@/shared/tree';
import { DICT_TYPE } from '@/store/DictStore';
import { ProFormDict } from '@/components/DictWrapper';
import { IconFont, IconSelect } from '@/components/Icon';
import {
  createMenu,
  listSimpleMenus,
  updateMenu,
} from '@/services/system/menu';
import type { MenuView } from '@/services/system/menu/types';

type Props = {
  menu?: MenuView;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const EditMenu: React.FC<Props> = observer((props) => {
  const { onOk, onClose, menu } = props;

  const formRef = useRef<ProFormInstance<MenuView>>();
  const isEdit = !!menu?.id;

  const handleIconSelect = (icon: string) => {
    formRef.current?.setFieldValue('icon', icon);
  };

  return (
    <DrawerForm<MenuView>
      open
      width={800}
      formRef={formRef}
      initialValues={{
        parentId: 0,
        type: 1,
        status: 0,
        ...menu,
      }}
      title={isEdit ? (menu?.id ? '修改菜单' : '新增菜单') : '查看菜单'}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose,
      }}
      grid
      rowProps={{ gutter: [16, 0] }}
      onFinish={async (values) => {
        let result = false;
        if (menu?.id) {
          result = await updateMenu({ ...menu, ...values });
        } else {
          result = await createMenu({ ...menu, ...values });
        }
        if (result) {
          message.success(menu?.id ? '修改成功' : '新增成功');
          onOk();
        }
      }}
    >
      <ProFormTreeSelect
        name="parentId"
        label="上级菜单"
        colProps={{ span: 24 }}
        request={async () => {
          let simpleMenus: Tree = { id: 0, name: '主类目', children: [] };
          const menus = await listSimpleMenus();
          if (menus) {
            simpleMenus.children = handleTree(menus);
          }
          return [simpleMenus];
        }}
        fieldProps={{
          fieldNames: {
            value: 'id',
            label: 'name',
          },
        }}
        rules={[{ required: true, message: '上级菜单不能为空' }]}
      />

      <ProFormRadio.Group
        name="type"
        label="菜单类型"
        colProps={{ span: 24 }}
        rules={[{ required: true, message: '菜单类型不能为空' }]}
        options={[
          {
            label: '目录',
            value: 1,
          },
          {
            label: '菜单',
            value: 2,
          },
          {
            label: '按钮',
            value: 3,
          },
        ]}
      />

      <ProForm.Item shouldUpdate noStyle>
        {(form) =>
          form.getFieldValue('type') !== 3 && (
            <IconSelect onSelect={handleIconSelect}>
              <ProForm.Item
                label="菜单图标"
                name="icon"
                style={{ padding: '0 8px' }}
                className="ant-col ant-col-24"
              >
                <Input
                  readOnly
                  placeholder="请选择图标"
                  prefix={<IconFont type={form.getFieldValue('icon')} />}
                  suffix={
                    <CloseOutlined
                      style={{ color: 'rgba(0,0,0,.45)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIconSelect('');
                      }}
                    />
                  }
                />
              </ProForm.Item>
            </IconSelect>
          )
        }
      </ProForm.Item>

      <ProFormText
        name="name"
        colProps={{ span: 12 }}
        label="菜单名称"
        placeholder="请输入菜单名称"
        rules={[{ required: true, message: '菜单名不能为空' }]}
      />

      <ProFormDigit
        name="sort"
        colProps={{ span: 12 }}
        label="显示顺序"
        min={0}
        placeholder="请输入数值"
        fieldProps={{ precision: 0 }}
        rules={[{ required: true, message: '显示顺序不能为空' }]}
      />

      <ProForm.Item noStyle shouldUpdate>
        {(form) =>
          form.getFieldValue('type') !== 3 && (
            <ProFormText
              name="path"
              colProps={{ span: 12 }}
              label="路由地址"
              placeholder="请输入路由地址"
              rules={[{ required: true, message: '请输入路由地址' }]}
            />
          )
        }
      </ProForm.Item>

      <ProForm.Item noStyle shouldUpdate>
        {(form) =>
          form.getFieldValue('type') === 2 && (
            <ProFormText
              name="component"
              colProps={{ span: 12 }}
              label="组件路径"
              placeholder="请输入组件路径"
            />
          )
        }
      </ProForm.Item>

      <ProForm.Item noStyle shouldUpdate>
        {(form) =>
          form.getFieldValue('type') !== 1 && (
            <ProFormText
              name="permission"
              colProps={{ span: 12 }}
              label="权限标识"
              placeholder="请输入权限标识"
            />
          )
        }
      </ProForm.Item>

      <ProFormDict
        name="status"
        label="菜单状态"
        placeholder="请选择菜单状态"
        colProps={{ span: 12 }}
        dictCode={DICT_TYPE.COMMON_STATUS}
        type="number"
        rules={[{ required: true, message: '请选择菜单状态' }]}
      />
    </DrawerForm>
  );
});
