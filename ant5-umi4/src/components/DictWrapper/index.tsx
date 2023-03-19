import { ProConfigProvider } from '@ant-design/pro-components';
import { observer } from '@formily/react';
import { Col, Form } from 'antd';
import classnames from 'classnames';
import React, { useMemo } from 'react';
import type { ProFormItemProps } from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import { DictSelect, DictItem } from './DictSelect';

type ProFormDictProps = {
  dictCode: DICT_TYPE;
  type?: 'number' | 'string';
  onChange?: (val?: string) => void;
  /**
   * 是否显示字典编码
   */
  codeVisible?: boolean;
} & ProFormItemProps;

const WIDTH_SIZE_ENUM = {
  // 适用于短数字，短文本或者选项
  xs: 104,
  s: 216,
  // 适用于较短字段录入、如姓名、电话、ID 等。
  sm: 216,
  m: 328,
  // 标准宽度，适用于大部分字段长度。
  md: 328,
  l: 440,
  // 适用于较长字段录入，如长网址、标签组、文件路径等。
  lg: 440,
  // 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
  xl: 552,
};

/**
 *
 * @param props 字典
 * @returns
 */
export const ProFormDict = (props: ProFormDictProps) => {
  const {
    dictCode,
    fieldProps,
    onChange,
    type,
    codeVisible,
    width,
    colProps = { span: 24 },
    ...rest
  } = props;

  const dictClassName = useMemo(() => {
    const isSizeEnum = width && WIDTH_SIZE_ENUM[width];
    return (
      classnames(fieldProps?.className, {
        'pro-field': isSizeEnum,
        [`pro-field-${width}`]: isSizeEnum,
      }) || undefined
    );
  }, [width, fieldProps?.className]);

  return (
    <Col {...colProps}>
      <Form.Item {...rest}>
        <DictSelect
          {...fieldProps}
          dictCode={dictCode}
          onChange={onChange}
          type={type}
          readonly={props.readonly}
          codeVisible={codeVisible}
          className={dictClassName}
          placeholder={props.placeholder}
        />
      </Form.Item>
    </Col>
  );
};

export const DictProWrapper: React.FC<any> = observer(({ children }) => (
  <ProConfigProvider
    valueTypeMap={{
      dict: {
        render: (text, props) => {
          const dictCode = props.fieldProps.dictCode;
          // 获取字典类型，可以根据字典类型解析出来字典的值
          return <DictItem dictCode={dictCode} value={text} />;
        },
        renderFormItem: (text, props) => {
          const dictCode = props.fieldProps.dictCode;
          return (
            <ProFormDict {...props} dictCode={dictCode} initialValue={text} />
          );
        },
      },
    }}
  >
    {children}
  </ProConfigProvider>
));
