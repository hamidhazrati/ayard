import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource } from '@angular/material/tree';
import { ITreeNode } from '@app/features/facilities/components/facility/facility.component';

@Component({
  selector: 'app-facility-tree',
  templateUrl: './facility-tree.component.html',
  styleUrls: ['./facility-tree.component.scss'],
})
export class FacilityTreeComponent {
  @Input() dataSource: MatTreeFlatDataSource<any, any>;
  @Input() treeControl: FlatTreeControl<any>;
  @Output() whenSelected: EventEmitter<any> = new EventEmitter<any>();

  hasChild(_: number, node: ITreeNode) {
    return !!node.children && node.children.length;
  }

  // events go here -----------------------------------------------------------

  onClick(node: any): void {
    this.whenSelected.emit(node);
  }
}
