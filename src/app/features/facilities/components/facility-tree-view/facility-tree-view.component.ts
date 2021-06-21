import { Component, Input } from '@angular/core';
import { ITreeNode } from '@app/features/facilities/components/facility/facility.component';

@Component({
  selector: 'app-facility-tree-view',
  templateUrl: './facility-tree-view.component.html',
  styleUrls: ['./facility-tree-view.component.scss'],
})
export class FacilityTreeViewComponent {
  @Input() facility: ITreeNode;

  // events go here -----------------------------------------------------------

  // @TODO: When menu item has been selected
  onMenuClick(action): void {}
}
