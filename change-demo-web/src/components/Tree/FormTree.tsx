import React from 'react';
import type { TreeNodeNormal, TreeProps } from './index';
import Tree from './index';

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
  treeData: TreeNodeNormal[];
  flatTreeData: TreeNodeNormal[];
  readonly?: boolean;
} & TreeProps;

export const FormTree: React.FC<Props> = (props) => {
  const { value = [], flatTreeData, onChange, readonly, ...rest } = props;

  return (
    <Tree
      checkable
      showIcon
      defaultCheckedKeys={value}
      checkedKeys={value}
      checkStrictly
      defaultExpandAll
      onCheck={({ checked }, info) => {
        const key = info.node.props.eventKey;
        if (!key || !onChange || readonly) {
          return;
        }
        const childNodesKey =
          flatTreeData?.filter((x) => x.key.startsWith(key)).map((x) => x.key) || [];
        // 如果选中，给所有子节点也选中
        if (info.checked) {
          onChange([...new Set([...checked, ...childNodesKey])]);
          return;
        }
        // 如果清除选中，给所有的子节点也清除选中
        if (!info.checked) {
          onChange((checked as string[]).filter((x) => !childNodesKey.includes(x)));
          return;
        }
      }}
      {...rest}
    />
  );
};
