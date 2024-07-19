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

  @Output()
  public nodeCheckedChange = new EventEmitter<boolean>();

  @Output()
  public nodeCheckedOnInit = new EventEmitter<boolean>();

  // public formControl = new FormControl(false);

  public hasChildren: boolean = false;

  public open = false;

  private localChecked = false;

  constructor(private cd: ChangeDetectorRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.hasChildren = !!this.item.children?.length;
    this.open = !!this.item.defaultOpen;

    // if (this.item.disabled) {
    //   this.formControl.disable({emitEvent: false});
    // }

    if (this.item.checked) {
      this.nodeCheckedOnInit.emit(true);
      this.localChecked = true;
    }
  }

  public get getIndeterminate(): boolean {
    return true;
  }

  public toggleOpen(): void {
    this.open = !this.open;
  }

  public onChange(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    const checkedFromEvent = eventTarget.checked; 
    console.log(checkedFromEvent, this.localChecked);

    const valueToEmit = this.item.hasDisabledUncheckedChildren ? !this.localChecked : checkedFromEvent;

    this.item.checked = valueToEmit;

    if (this.hasChildren) {
      this.item.children = this.getChildrenWithChangedCheck(this.item.children!, valueToEmit);
    }

    this.nodeCheckedChange.emit(valueToEmit);

    if (this.item.hasDisabledUncheckedChildren) {
      console.log('from if disabled unchecked');
      // TODO  разобратьcя почему установка аттрибутов через Renderer2 не работает
      eventTarget.checked = false;
      eventTarget.indeterminate = valueToEmit;
      // this.cd.detectChanges();
    }

    if (valueToEmit && this.item.hasDisabledCheckedChildren){
      console.log('from if disabled checked')
      eventTarget.checked = false;
      eventTarget.indeterminate = true;
    }

    this.localChecked = valueToEmit;




    // this.formControl.setValue(false, { emitEvent: false});
    // this.item.indeterminate = true;
    // this.cd.detectChanges();
    // console.log({formControl: this.formControl})

    // console.log(event);

    // @ts-ignore
    // event.target['checked'] = false;
    // this.cd.detectChanges();

  }

  public onChildCheckChange(event: boolean, onInit = false): void {
    console.log({event, id: this.item.id})
    const childrenChecked = this.item.children?.filter(child => child.checked);

    const emitter = onInit ? this.nodeCheckedOnInit : this.nodeCheckedChange;
    
    if (childrenChecked?.length === this.item.children?.length) {
      console.log('from checked all children')
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