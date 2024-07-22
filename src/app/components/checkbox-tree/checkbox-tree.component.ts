import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TreeNode } from "../../interfaces/tree-node";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TreeNodeComponent } from "../tree-node/tree-node.component";
import { TreeStructureItem } from "../../interfaces/tree-structure-item";
import { TreeLeafsValues } from "../../types/tree-leafs-values";

@Component({
  selector: 'app-checkbox-tree',
  standalone: true,
  imports: [TreeNodeComponent, ReactiveFormsModule],
  templateUrl: './checkbox-tree.component.html',
  styleUrl: './checkbox-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxTreeComponent implements OnInit {
  @Input()
  public items!: TreeStructureItem[];

  @Output()
  public treeLeafsValuesChange = new EventEmitter<TreeLeafsValues>();

  public tree: TreeNode[] = [];

  private treeNodeMap: Record<string, TreeNode> = {};


  ngOnInit(): void {
    this.initTree(this.items, []);
    this.tree = this.items as TreeNode[];
  }

  public onNodeCheckedChange() {
    const treeLeafCheckedMap: TreeLeafsValues = {};

    this.getLeafValues(this.tree, treeLeafCheckedMap);

    this.treeLeafsValuesChange.emit(treeLeafCheckedMap);
  }

  private getLeafValues (tree: TreeStructureItem[], map: Record<string, boolean>) {
    tree.forEach((item) => {
      if (!item.children) {
        map[item.id] = !!item.checked;
        return;
      }
      this.getLeafValues(item.children, map);
    })
  }

  private initTree(items: TreeStructureItem[], ancestorsIds: string[]): void {
    items.forEach((item) => {
      const nodeItem = item as TreeNode;
      nodeItem.ancestorsIds = ancestorsIds;
      this.treeNodeMap[item.id] = nodeItem;

      if (item.disabled) {
        this.changeValueInNodes({nodeIds: ancestorsIds, key: item.checked ? 'hasDisabledCheckedChildren' : 'hasDisabledUncheckedChildren', value: true});
      }

      if (item.checked) {
        this.changeValueInNodes({nodeIds: ancestorsIds, key: 'indeterminate', value: true});
      }

      if (item.children) {
        this.initTree(item.children, [...ancestorsIds, item.id]);
      }
    })
  }

  private changeValueInNodes({nodeIds, key, value}: {nodeIds: string[], key: 'hasDisabledCheckedChildren' | 'hasDisabledUncheckedChildren' | 'indeterminate', value: boolean}) {
    nodeIds.forEach((id) => {
      if (!this.treeNodeMap[id]) {
        return;
      }

      this.treeNodeMap[id][key] = value;
    })
  }
}