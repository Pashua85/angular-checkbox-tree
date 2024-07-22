import { TreeStructureItem } from "./tree-structure-item";

export type TreeNode = Omit<TreeStructureItem, 'children'> & {
  children?: TreeNode[],
  indeterminate?: boolean;
  ancestorsIds: string[];
  hasDisabledCheckedChildren?: boolean;
  hasDisabledUncheckedChildren?: boolean;
}