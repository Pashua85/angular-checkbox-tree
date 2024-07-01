import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChange } from "@angular/core";
import { TreeNode } from "../../interfaces/tree-node";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";



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

  @Output()
  public nodeCheckedChange = new EventEmitter<boolean>();

  @Output()
  public nodeCheckedOnInit = new EventEmitter<boolean>();

  public hasChildren: boolean = false;

  public open = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.hasChildren = !!this.item.children?.length;
    this.open = !!this.item.defaultOpen;

    if (this.item.checked) {
      console.log('checked on init', this.item.id);
      this.nodeCheckedOnInit.emit(true);
    }
  }

  public get getIndeterminate(): boolean {
    return true;
  }

  public toggleOpen(): void {
    this.open = !this.open;
  }

  public onChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked; 
    this.item.checked = checked;
    if (this.hasChildren) {
      this.item.children = this.getChildrenWithChangedCheck(this.item.children!, checked);
    }
    this.nodeCheckedChange.emit(checked);
  }

  public onChildCheckChange(event: boolean, onInit = false): void {
    console.log({event, id: this.item.id})
    const childrenChecked = this.item.children?.filter(child => child.checked);

    const emitter = onInit ? this.nodeCheckedOnInit : this.nodeCheckedChange;
    
    if (childrenChecked?.length === this.item.children?.length) {
      this.item.indeterminate = false;
      this.item.checked = true;
      emitter.emit(event);
      return;
    }

    const indeterminateChildren = this.item.children?.filter(child => child.indeterminate);

    if (!!childrenChecked?.length || !!indeterminateChildren?.length) {
      this.item.indeterminate = true;
      this.item.checked = false;
      emitter.emit(event);

      if (onInit) {
        this.cd.detectChanges();
      }
      
      return;
    }

    this.item.indeterminate = false;
    this.item.checked = false;

    emitter.emit(event);
  }

  private getChildrenWithChangedCheck(children: TreeNode[], value: boolean): TreeNode[] {
    return children.map(child => {
      if (child.children) {   
        return {
          ...child,
          checked: child.disabled ? child.checked : value,
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