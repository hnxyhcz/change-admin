import { observer } from '@formily/react';
import { Input, Tree } from 'antd';
import { useMemo, useState } from 'react';
import type { DataNode } from 'antd/lib/tree';

import { useDictStore } from '@/shared/useStore';
import { DictData, DICT_TYPE } from '@/store/DictStore';

type Props = {
  onSelect: (val?: number) => void;
};

const getParentKey = (key: React.Key, tree: DictData[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.value === key)) {
        parentKey = node.value;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

export const DeptTree = observer((props: Props) => {
  const { dictMap, cascadeMap } = useDictStore();
  const [searchValue, setSearchValue] = useState<string>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>();

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
  };

  const onSelect = (keys: React.Key[]) => {
    if (keys.length > 0) {
      props.onSelect(keys[0] as number);
    } else {
      props.onSelect(undefined);
    }
  };

  const searchDept = (value: string) => {
    const newExpandedKeys = dictMap[DICT_TYPE.DEPT]
      ?.map((item) => {
        if (item.label.indexOf(value) > -1) {
          return getParentKey(item.value, cascadeMap[DICT_TYPE.DEPT]);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setSearchValue(value);
    setExpandedKeys(newExpandedKeys as React.Key[]);
  };

  const treeData = useMemo(() => {
    const loop = (data: DictData[]): DataNode[] => {
      const result: DataNode[] = [];
      data?.map(({ label, value, children }) => {
        if (children && children.length !== 0) {
          const newChild = loop(children);
          if (!searchValue || newChild.length > 0) {
            result.push({ title: label, key: value, children: newChild });
          }
        } else if (!searchValue || label.indexOf(searchValue) >= 0) {
          result.push({ title: label, key: value });
        }
      });
      return result;
    };

    return loop(cascadeMap[DICT_TYPE.DEPT]);
  }, [searchValue, cascadeMap[DICT_TYPE.DEPT]]);

  return (
    <>
      <Input.Search style={{ marginBottom: 8 }} onSearch={searchDept} />
      <Tree
        defaultExpandAll
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        treeData={treeData}
        onSelect={onSelect}
      />
    </>
  );
});
