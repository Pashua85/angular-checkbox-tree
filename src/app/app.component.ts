import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckboxTreeComponent } from './components/checkbox-tree/checkbox-tree.component';
import { TreeLeafsValues } from './types/tree-leafs-values';
import { treeNodes } from './mock';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , CheckboxTreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public treeNodes = treeNodes;

  public selectedLeafsIds: string[]= []

  public onLeafsChange(event: TreeLeafsValues) {
    this.selectedLeafsIds = Object.keys(event).filter(key => event[key]);
  }
}
