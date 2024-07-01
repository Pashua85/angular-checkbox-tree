import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckboxTreeComponent } from './components/checkbox-tree/checkbox-tree.component';
import { TreeNode } from './interfaces/tree-node';



const treeNodes: TreeNode[] = [
  {
    name: 'branch1',
    id: 'branch1',
    checked: false,
    disabled: false,
    children: [
      {
        name: 'branch1-1',
        id: 'branch1-1',
        checked: false,
        disabled: false
      },
      {
        name: 'branch1-2',
        id: 'branch1-2',
        checked: false,
        disabled: false,
        children: [
          {
            name: 'branch1-2-1',
            id: 'branch1-2-1',
            checked: false,
            disabled: false
          },
          {
            name: 'branch1-2-2',
            id: 'branch1-2-2',
            checked: false,
            disabled: false
          },
        ]
      },
      {
        name: 'branch1-3',
        id: 'branch1-3',
        checked: false,
        disabled: false
      }
    ]
  },
  {
    name: 'branch2',
    id: 'branch2',
    checked: false,
    disabled: false,
    defaultOpen: true,
    children: [
      {
        name: 'branch2-1',
        id: 'branch2-1',
        checked: false,
        disabled: false,
        defaultOpen: true,
        children: [
          {
            name: 'branch2-1-1',
            id: 'branch2-1-1',
            checked: false,
            disabled: false,
            defaultOpen: true,
            children: [
              {
                name: 'branch2-1-1-1',
                id: 'branch2-1-1-1',
                checked: true,
                disabled: true,
              },
              {
                name: 'branch2-1-1-2',
                id: 'branch2-1-1-2',
                checked: false,
                disabled: false,
              }
            ]
          },
          {
            name: 'branch2-1-2',
            id: 'branch2-1-2',
            checked: false,
            disabled: false
          },
          {
            name: 'branch2-1-3',
            id: 'branch2-1-3',
            checked: false,
            disabled: false
          },
        ]
      },
      {
        name: 'branch2-2',
        id: 'branch2-2',
        checked: false,
        disabled: false,
      },
      {
        name: 'branch2-3',
        id: 'branch2-3',
        checked: false,
        disabled: false
      }
    ]
  }
]

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , CheckboxTreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public treeNodes = treeNodes;
}
