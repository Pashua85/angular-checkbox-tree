import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TreeNode } from "../../interfaces/tree-node";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TreeNodeComponent } from "../tree-node/tree-node.component";

@Component({
  selector: 'app-checkbox-tree',
  standalone: true,
  imports: [TreeNodeComponent, ReactiveFormsModule],
  templateUrl: './checkbox-tree.component.html',
  styleUrl: './checkbox-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxTreeComponent {
  @Input()
  public items!: TreeNode[];

  public formGroup = new FormGroup({});
}