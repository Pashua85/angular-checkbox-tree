import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChange } from "@angular/core";
import { TreeNode } from "../../interfaces/tree-node";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";



@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tree-node.component.html',
  styleUrl: './tree-node.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeNodeComponent implements OnInit {
  @Input()
  public item!: TreeNode;

  @Input()
  public checked: boolean = false;

  @Input()
  public indeterminate: boolean = false;

  @Output()
  public nodeCheckedChange = new EventEmitter<boolean>();

  public hasChildren: boolean = false;

  public open = false;

  private localChecked = false;

  constructor() {}

  ngOnInit(): void {
    this.hasChildren = !!this.item.children?.length;
    this.open = !!this.item.defaultOpen;

    if (this.item.checked) {
      this.localChecked = true;
    }
  }

  public get getIndeterminate(): boolean {
    return true;
  }

  public toggleOpen(): void {
    this.open = !this.open;
  }

  public onClick(): void {
    if (this.item.disabled) {
      return;
    }

    const valueToEmit = !this.localChecked;

    if (!this.item.hasDisabledCheckedChildren && !this.item.hasDisabledUncheckedChildren)  {
      this.item.checked = valueToEmit;
    }

    if (this.item.hasDisabledUncheckedChildren) {
      this.item.checked = false;
      this.item.indeterminate = valueToEmit;
    }

    if (this.item.hasDisabledCheckedChildren){

      this.item.checked = valueToEmit;
      this.item.indeterminate = true;
    }

    if (this.hasChildren) {
      this.item.children = this.getChildrenWithChangedCheck(this.item.children!, valueToEmit);
    }

    this.nodeCheckedChange.emit(valueToEmit);

    this.localChecked = valueToEmit;
  }

  public onChildCheckChange(event: boolean): void {
    const childrenChecked = this.item.children?.filter(child => child.checked);
    
    if (childrenChecked?.length === this.item.children?.length) {

      this.item.indeterminate = false;
      this.item.checked = true;
      this.indeterminate = false;
      this.checked = true;
      this.nodeCheckedChange.emit(event);
      return;
    }

    const indeterminateChildren = this.item.children?.filter(child => child.indeterminate);

    if (!!childrenChecked?.length || !!indeterminateChildren?.length) {
      this.item.indeterminate = true;
      this.item.checked = false;
      this.indeterminate = true;
      this.checked = false;
      this.nodeCheckedChange.emit(event);
      
      return;
    }

    this.item.indeterminate = false;
    this.item.checked = false;
    this.indeterminate = false;
    this.checked = false;

    this.nodeCheckedChange.emit(event);
  }

  private getChildrenWithChangedCheck(children: TreeNode[], value: boolean): TreeNode[] {
    return children.map(child => {
      if (child.children) {  
        const newValues: Partial<TreeNode> = {
          checked: child.disabled ? child.checked : value
        } 

        if (child.hasDisabledUncheckedChildren) {
          newValues.checked = false;
          newValues.indeterminate = value;
        }

        if (child.hasDisabledCheckedChildren) {
          newValues.indeterminate = true;
        }

        return {
          ...child,
          ...newValues,
          children: this.getChildrenWithChangedCheck(child.children, value)
        }
      }

      return {
        ...child,
        checked: child.disabled ? child.checked : value
      }
    })
  }
}