import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { TreeNode } from "../../interfaces/tree-node";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TreeNodeComponent } from "../tree-node/tree-node.component";
import { TreeStructureItem } from "../../interfaces/tree-structure-item";

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

  public tree: TreeNode[] = [];

  private treeNodeMap: Record<string, TreeNode> = {};

  ngOnInit(): void {
    this.initTree(this.items, []);
    this.tree = this.items as TreeNode[];
  }

  private initTree(items: TreeStructureItem[], ancestorsIds: string[]): void {
    items.forEach((item) => {
      const nodeItem = item as TreeNode;
      nodeItem.ancestorsIds = ancestorsIds;
      this.treeNodeMap[item.id] = nodeItem;

      if (item.disabled) {
        this.changValueInNodes({nodeIds: ancestorsIds, key: item.checked ? 'hasDisabledCheckedChildren' : 'hasDisabledUncheckedChildren', value: true});
      }

      if (item.children) {
        this.initTree(item.children, [...ancestorsIds, item.id]);
      }
    })
  }

  private changValueInNodes({nodeIds, key, value}: {nodeIds: string[], key: 'hasDisabledCheckedChildren' | 'hasDisabledUncheckedChildren', value: boolean}) {
    nodeIds.forEach((id) => {
      if (!this.treeNodeMap[id]) {
        return;
      }

      this.treeNodeMap[id][key] = value;
    })
  }
}