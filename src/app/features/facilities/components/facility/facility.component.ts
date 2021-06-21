import { FacilityTreeService } from './../../services/facility-tree.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ActivatedRoute } from '@angular/router';
import { pluck, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export interface ITreeNode {
  name: string;
  level?: number;
  children?: ITreeNode[];
  breadcrumb?: string[]; // rename to breadcrumb and alter this...
  data?: any;
}

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.scss'],
})
export class FacilityComponent implements OnDestroy, OnInit {
  dataSource: MatTreeNestedDataSource<ITreeNode> = new MatTreeNestedDataSource<ITreeNode>();
  treeControl: NestedTreeControl<ITreeNode> = new NestedTreeControl<ITreeNode>(
    (node) => node.children,
  );
  facility: ITreeNode;
  subscriptions: Subscription = new Subscription();

  constructor(
    private readonly router: ActivatedRoute,
    private readonly facilityTreeService: FacilityTreeService,
  ) {}

  ngOnInit(): void {
    const sub = this.router.data
      .pipe(
        pluck('exposure'),
        switchMap((exposure) => this.facilityTreeService.generateTree(exposure)),
      )
      .subscribe((tree: ITreeNode) => {
        this.dataSource.data = [tree];
        this.facility = tree;
      });
    this.subscriptions.add(sub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // events go here -----------------------------------------------------------

  onSelected(facility: ITreeNode): void {
    this.facility = facility;
  }
}
