export interface TreeStructureItem {
  name: string;
  id: string;
  checked?: boolean;
  disabled?: boolean;
  children?: TreeStructureItem[];
  defaultOpen?: boolean;
}