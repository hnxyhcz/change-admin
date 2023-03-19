import { useState } from 'react';
import { CheckCard } from '@ant-design/pro-components';
import { createFromIconfontCN, SearchOutlined } from '@ant-design/icons';
import { Col, Divider, Input, Popover, PopoverProps, Row, Tooltip } from 'antd';
import { IconUrl, IconMap } from './data';

import style from './style.less';
import { debounce } from 'lodash';

type IconDataType = Record<string, string[]>;

type IconSelectProps = {
  show?: boolean;
  onSelect: (icon: string) => void;
} & PopoverProps;

export const IconFont = createFromIconfontCN({
  scriptUrl: IconUrl,
});

export const IconSelect = (props: IconSelectProps) => {
  const { show = false, onSelect, children, ...popoverProps } = props;
  const [data, setData] = useState<IconDataType>(IconMap);

  const handleSearchIcon = (search: string = '') => {
    let newIconMap: Record<string, string[]> = {};
    Object.keys(IconMap).forEach((key) => {
      const iconData = IconMap[key]?.filter((icon: string) =>
        icon.includes(search),
      );
      if (iconData && iconData.length > 0) {
        newIconMap[key] = iconData;
      }
    });
    setData(newIconMap);
  };

  return (
    <Popover
      trigger="click"
      placement="bottom"
      title={
        <Input
          placeholder="请输入图标名称"
          suffix={
            <Tooltip title="搜索">
              <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          }
          onChange={debounce((e) => handleSearchIcon(e.target.value), 500)}
        />
      }
      content={
        <div
          style={{
            width: '745px',
            maxHeight: '400px',
            overflowX: 'hidden',
            overflowY: 'scroll',
          }}
        >
          {Object.keys(data).map((key) => {
            return (
              <>
                <Divider orientation="center" style={{ marginTop: 0 }}>
                  {key}
                </Divider>
                <Row gutter={[12, 8]}>
                  {data[key].map((icon: string) => (
                    <Col span={4} title={icon}>
                      <CheckCard
                        checked={false}
                        style={{ width: '100px' }}
                        className={style['icon-card']}
                        title={
                          <IconFont type={icon} style={{ fontSize: 36 }} />
                        }
                        onClick={() => onSelect(icon)}
                      />
                    </Col>
                  ))}
                </Row>
              </>
            );
          })}
        </div>
      }
      {...popoverProps}
    >
      {children}
    </Popover>
  );
};

export const getIcon = (
  icon: string | React.ReactNode,
  iconPrefixes: string = 'icon-',
): React.ReactNode => {
  if (typeof icon === 'string' && icon !== '') {
    // 可加入多种图标类型的兼容写法，此处省略
    if (icon.startsWith(iconPrefixes)) {
      return <IconFont type={icon} style={{ fontSize: '16px' }} />;
    }
    if (icon.startsWith('logo-')) {
      return <IconFont type={icon} style={{ fontSize: '16px' }} />;
    }
  }
  return icon;
};
