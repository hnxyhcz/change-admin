import { observer } from '@formily/react';
import { Select, Space, Tag } from 'antd';
import { useEffect } from 'react';
import type { SelectProps } from 'antd';

import { useDictStore } from '@/shared/useStore';
import { DictData, DICT_TYPE } from '@/store/DictStore';

const { Option } = Select;

export type DictSelectProps = {
  dictCode: DICT_TYPE;
  onChange?: (val: string) => void;
  value?: string;
  type?: 'number' | 'string';
  filter?: (item: DictData) => boolean;
  /**
   * 是否显示字典编码
   */
  codeVisible?: boolean;
  readonly?: boolean;
} & SelectProps;

function getValueByType(
  val: string | number | undefined | string[] | number[],
  type: 'number' | 'string' = 'string',
) {
  if (val === undefined) {
    return undefined;
  }

  if (type === 'string') {
    if (val instanceof Array) {
      return val.map((v) => `${v}`);
    }
    return `${val}`;
  }

  if (type === 'number') {
    if (val instanceof Array) {
      return val.map((v) => parseFloat(`${v}`));
    }
    return parseFloat(`${val}`);
  }
  return val;
}

/**
 * 只读模式渲染
 */
const DictItem = observer(
  ({ dictCode, value }: { dictCode: DICT_TYPE; value: any }) => {
    const dictStore = useDictStore();

    useEffect(() => {
      dictStore.getDictData(dictCode);
    }, [dictCode, dictStore]);

    if (Array.isArray(value)) {
      return (
        <Space size={2}>
          {value.map((val) => {
            const dictItem = dictStore.getDictItem(dictCode, val);
            return (
              <Tag color={dictItem.colorType} key={dictItem.value}>
                {dictItem.label || val}
              </Tag>
            );
          })}
        </Space>
      );
    }

    const dictItem = dictStore.getDictItem(dictCode, value);
    if (dictItem && dictItem.colorType) {
      return (
        <Tag color={dictItem.colorType} key={dictItem.value}>
          {dictItem.label}
        </Tag>
      );
    }
    return <span>{dictItem?.label || '-'}</span>;
  },
);

/**
 * 下拉字典
 */
const DictSelect = observer((props: DictSelectProps) => {
  const {
    dictCode,
    value,
    onChange,
    type,
    filter,
    readonly,
    ...rest
  } = props;
  const dictStore = useDictStore();
  const items = dictStore.dictMap[dictCode] || [];

  useEffect(() => {
    dictStore.getDictData(dictCode);
  }, [dictCode, dictStore]);

  if (!!readonly) {
    return <DictItem dictCode={dictCode} value={value} />;
  }

  return (
    <Select
      allowClear
      showSearch
      onChange={onChange}
      {...rest}
      value={getValueByType(value, type)}
    >
      {items
        .filter((item) => {
          if (filter) {
            return filter(item);
          } else {
            return true;
          }
        })
        .map((item) => (
          <Option key={item.value} value={getValueByType(item.value, type)}>
            {item.label}
          </Option>
        ))}
    </Select>
  );
});

export { DictSelect, DictItem };
