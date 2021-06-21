import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { LayoutService } from '@app/core/services/layout.service';
import { ResolveExceptionsComponent } from '@app/features/exceptions/components/resolve-exceptions/resolve-exceptions.component';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { SideBarDialogService } from '@app/shared/components/side-bar-dialog/side-bar-dialog.service';
import { Page, PageRequestFactory } from '@app/shared/pagination';
import { PaginationMeta } from '@app/shared/pagination/model/Pagination';
import {
  BulkActionButtonMeta,
  ButtonType,
  GdsCellAlign,
  GdsColumn,
  GdsColumnType,
  GdsPaginationEvent,
  GdsPaginationMeta,
  GdsSortEvent,
  SortDirection,
} from '@greensill/gds-ui/data-table';
import { GdsSorting } from '@greensill/gds-ui/data-table/shared/data-table-types';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ViewExceptionComponent } from '../view-exception/view-exception.component';
import { listExceptionsCrumb } from './list-exceptions.crumb';

@Component({
  selector: 'app-list-exceptions',
  templateUrl: './list-exceptions.component.html',
  styleUrls: ['./list-exceptions.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListExceptionsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  private pageSize: number;
  public sorting: GdsSorting;
  public paginationMeta: GdsPaginationMeta = PaginationMeta;
  public defaultSorts: GdsSorting[] = [
    {
      prop: 'createdDate',
      dir: SortDirection.desc,
    },
  ];
  public rows: any = [];
  public columns: GdsColumn[] = [
    {
      prop: 'type',
      name: 'Exception Type',
      type: GdsColumnType.TitleCase,
      columnWidth: 200,
      frozenLeft: true,
    },
    {
      prop: 'attributes.relatedEntity',
      name: 'Related Entity',
      type: GdsColumnType.InnerHTML,
      columnWidth: 150,
      frozenLeft: true,
    },
    {
      prop: 'attributes.primaryEntity',
      name: 'Primary Entity',
      type: GdsColumnType.InnerHTML,
      columnWidth: 150,
      frozenLeft: true,
    },
    {
      prop: 'statusInfo.status',
      name: 'Status',
      type: GdsColumnType.InnerHTML,
      columnWidth: 180,
      frozenLeft: true,
    },
    { prop: 'sourceId', name: 'Exception Id', columnWidth: 310 },
    { prop: 'attributes.cashflowFileId', name: 'Cashflow Identifier', columnWidth: 240 },
    {
      prop: 'attributes.certifiedAmountCurrency',
      name: 'Currency',
      cellAlign: GdsCellAlign.Right,
      columnWidth: 80,
    },
    {
      prop: 'attributes.certifiedAmount',
      name: 'Certified Amount',
      type: GdsColumnType.Currency,
      cellAlign: GdsCellAlign.Right,
      columnWidth: 150,
    },
    { prop: 'attributes.contractName', name: 'Contract', columnWidth: 350 },
    { prop: 'message', name: 'Exception Description', columnWidth: 350 },
    {
      prop: 'createdDate',
      name: 'Created',
      type: GdsColumnType.DateTime,
      columnWidth: 160,
    },
    { prop: 'lastActionedBy', columnWidth: 150 },
  ];

  public groupedColumnProps: string[] = ['type', 'relatedEntity', 'primaryEntity', 'status'];
  public bulkActionButtons: BulkActionButtonMeta[] = [
    { text: 'Resolve exceptions', show: true, buttonType: ButtonType.Raised },
  ];
  public taskGroupId: string;
  public groupTasks = false;
  public showRowSelect = false;
  public searchQuery: string;

  constructor(
    private taskService: TaskService,
    private crumbService: CrumbService,
    private sideBarDialogService: SideBarDialogService,
    private layoutService: LayoutService,
  ) {}

  ngOnInit() {
    this.setupSubscription();
    this.crumbService.setCrumbs(listExceptionsCrumb());
    this.layoutService.showBodyGrid(false);
    this.getTasks();
  }

  private setupSubscription() {
    this.taskService.updateTasksEvent$
      .pipe(filter(Boolean), takeUntil(this.onDestroy$))
      .subscribe(() => this.getTasks());
  }

  public sort(event: GdsSortEvent): void {
    this.sorting = event.sorts[0];
    return this.getTasks();
  }

  public getSearchQuery(): string | undefined {
    return this.searchQuery?.length ? this.searchQuery : undefined;
  }

  public getTasks(event?: GdsPaginationEvent) {
    // GdsPaginationEvent is not fired on a column sort
    // so any changes to pageSize on the ui are lost when sorting
    // cache pageSize so previously set value is not lost
    if (event) {
      this.pageSize = event.pageSize;
    }

    const params: HttpParams = new PageRequestFactory().createHttpParams(
      {
        ...event,
        ...(this.pageSize && { pageSize: this.pageSize }),
      },
      this.sorting || this.defaultSorts[0],
      this.getSearchQuery(),
    );

    this.taskService
      .getTasks(params, this.groupTasks ? this.groupedColumnProps : null)
      .pipe(take(1))
      .subscribe((page: Page<Task>) => {
        this.rows = page.data;
        this.paginationMeta = Object.assign(this.paginationMeta, { ...page.meta.paged });
      });
  }

  public openSideBar(task: Task) {
    this.sideBarDialogService.open<ViewExceptionComponent, Task, number>(
      ViewExceptionComponent,
      task,
      500,
    );
  }

  public onBulkActionSelection($event: Task[]): void {
    this.sideBarDialogService.open<ResolveExceptionsComponent, Task[], number>(
      ResolveExceptionsComponent,
      $event,
      500,
    );
  }

  public onGroupActionEvent($event: any): void {
    this.groupTasks = $event.performGrouping;
    this.showRowSelect = $event.performGrouping;
    this.taskGroupId = $event.performGrouping ? 'taskGroupId' : '';
    this.getTasks();
  }

  public onSearch($event: string): void {
    this.searchQuery = $event.trim();
    this.getTasks();
  }

  ngOnDestroy(): void {
    this.layoutService.showBodyGrid(true);
    this.onDestroy$.next();
  }
}
