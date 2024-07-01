export interface TreeNode {
  name: string;
  id: string;
  checked?: boolean;
  disabled?: boolean;
  children?: TreeNode[];
  defaultOpen?: boolean;
  indeterminate?: boolean;
}