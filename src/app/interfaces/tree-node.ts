import { TreeStructureItem } from "./tree-structure-item";

// export interface TreeNode {
//   name: string;
//   id: string;
//   checked?: boolean;
//   disabled?: boolean;
//   children?: TreeNode[];
//   defaultOpen?: boolean;

// }

export type TreeNode = Omit<TreeStructureItem, 'children'> & {
  children?: TreeNode[],
  indeterminate?: boolean;
  ancestorsIds: string[];
  hasDisabledCheckedChildren?: boolean;
  hasDisabledUncheckedChildren?: boolean;
}