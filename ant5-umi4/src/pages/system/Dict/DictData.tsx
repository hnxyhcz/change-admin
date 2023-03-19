import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalForm, PageContainer, ProTable } from '@ant-design/pro-components';
import {
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Modal, Tag } from 'antd';
import { observer } from '@formily/reactive-react';
import { useRef, useState } from 'react';
import { useParams } from '@umijs/max';
import type {
  ActionType,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import { ProFormDict } from '@/components/DictWrapper';
import { listSimpleDictTypeApi } from '@/services/system/dict/dictType';
import {
  createDictDataApi,
  deleteDictDataApi,
  getDictDataPageApi,
  updateDictDataApi,
} from '@/services/system/dict/dictData';
import type {
  DictDataPageReqVO,
  DictDataVO,
} from '@/services/system/dict/types';

const DictData: React.FC = observer(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const { dictType } = useParams<{ dictType: string }>();

  const [modalInfo, setModalInfo] = useState<{
    visible: boolean;
    current?: DictDataVO;
  }>();

  const columns: ProColumns<DictDataVO, 'dict'>[] = [
    {
      title: '字典名称',
      dataIndex: 'dictType',
      hideInTable: true,
      valueType: 'select',
      formItemProps: {
        initialValue: dictType,
      },
      fieldProps: {
        fieldNames: {
          label: 'name',
          value: 'type',
        },
      },
      request: async () => listSimpleDictTypeApi(),
    },
    {
      title: '字典编码',
      dataIndex: 'id',
      ellipsis: true,
      filters: true,
    },
    {
      title: '字典标签',
      dataIndex: 'label',
      hideInSearch: true,
    },
    {
      title: '字典键值',
      dataIndex: 'value',
      hideInSearch: true,
    },
    {
      title: '字典排序',
      dataIndex: 'sort',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'dict',
      fieldProps: {
        dictCode: DICT_TYPE.COMMON_STATUS,
      },
    },
    {
      title: '颜色类型',
      dataIndex: 'colorType',
      hideInSearch: true,
      render: (text, record) => {
        return <Tag color={record.colorType}>{text}</Tag>;
      },
    },
    {
      title: 'CSS Class',
      dataIndex: 'cssClass',
      hideInSearch: true,
    },
    {
      title: '描述',
      dataIndex: 'remark',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      valueType: 'date',
      width: 200,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_, record) => {
        return [
          <a
            key="edit"
            onClick={() => {
              setModalInfo({ visible: true, current: record });
            }}
          >
            编辑
          </a>,
          <a
            key="delete"
            onClick={() => {
              Modal.confirm({
                title: '删除',
                content: '确定删除当前字典?',
                icon: <ExclamationCircleOutlined />,
                onOk: () => {
                  deleteDictDataApi(record.id).then(() => {
                    actionRef.current?.reload();
                  });
                },
              });
            }}
          >
            删除
          </a>,
        ];
      },
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<DictDataVO, DictDataPageReqVO, 'dict'>
        bordered
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        request={getDictDataPageApi}
        scroll={{ x: 800 }}
        columnsState={{
          persistenceKey: 'system-dict-data',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        headerTitle="字典数据"
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setModalInfo({ visible: true })}
          >
            新增
          </Button>,
        ]}
      />

      {/* 新增表单 */}
      {modalInfo?.visible && (
        <ModalForm<DictDataVO>
          open
          title={modalInfo?.current ? '修改字典数据' : '添加字典数据'}
          modalProps={{
            destroyOnClose: true,
            onCancel: () => setModalInfo(undefined),
          }}
          initialValues={{
            status: 0,
            colorType: 'default',
            dictType: formRef.current?.getFieldValue('dictType'),
            ...modalInfo?.current,
          }}
          width={600}
          grid
          rowProps={{ gutter: [16, 0] }}
          onFinish={async (values) => {
            let res;
            if (modalInfo?.current?.id) {
              res = await updateDictDataApi({
                ...modalInfo?.current,
                ...values,
              });
            } else {
              res = await createDictDataApi(values);
            }
            if (res) {
              setModalInfo(undefined);
              actionRef.current?.reload();
            }
          }}
        >
          <ProFormText
            name="dictType"
            label="字典类型"
            placeholder="请输入字典名称"
            disabled
          />
          <ProFormText
            name="label"
            label="数据标签"
            placeholder="请输入数据标签"
            rules={[{ required: true, message: '数据标签不能为空' }]}
          />
          <ProFormText
            name="value"
            label="数据键值"
            placeholder="请输入数据键值"
            rules={[{ required: true, message: '数据键值不能为空' }]}
          />
          <ProFormDigit
            name="sort"
            label="显示顺序"
            min={0}
            placeholder="请输入数值"
            fieldProps={{ precision: 0 }}
            rules={[{ required: true, message: '显示顺序不能为空' }]}
          />
          <ProFormDict
            name="status"
            label="状态"
            type="number"
            placeholder="请选择状态"
            dictCode={DICT_TYPE.COMMON_STATUS}
          />
          <ProFormSelect
            name="colorType"
            label="颜色类型"
            options={[
              {
                label: '默认（default）',
                value: 'default',
              },
              {
                label: '成功（success）',
                value: 'success',
              },
              {
                label: '信息（processing）',
                value: 'processing',
              },
              {
                label: '警告（warning）',
                value: 'warning',
              },
              {
                label: '错误（error）',
                value: 'error',
              },
            ]}
          />
          <ProFormText
            name="cssClass"
            label="CSS Class"
            placeholder="请输入CSS Class"
          />
          <ProFormTextArea
            name="remark"
            label="描述"
            placeholder="请输入描述信息"
          />
        </ModalForm>
      )}
    </PageContainer>
  );
});

export default DictData;
