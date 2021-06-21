import { Component, OnDestroy, OnInit } from '@angular/core';
import { EntityService } from '@entities/services/entity.service';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { listEntitiesCrumb } from '@entities/components/list-entities/list-entities.crumb';
import { Entity } from '@entities/models/entity.model';
import { AuthService } from '@app/auth/auth-service';
import { UtilService } from '@app/shared/util/util.service';
import { BarcodeFormat } from '@zxing/library';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-entities',
  templateUrl: './list-entities.component.html',
  styleUrls: ['./list-entities.component.scss'],
})
export class ListEntitiesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'address', 'status'];
  loading = false;
  query = '';
  subscriptions = new Subscription();
  readonly searchValueChanged: Subject<string> = new Subject<string>();
  readonly source: BehaviorSubject<any> = new BehaviorSubject<any>({ entities: [], meta: null });

  readonly source$: Observable<Entity[]> = this.source.asObservable();
  entities$: Observable<Entity[]> = this.source$.pipe(pluck('entities'));
  meta$: Observable<any> = this.source$.pipe(pluck('meta'));
  isAuthorized$: Observable<boolean> = from(this.authService.isAuthorised('entity:write'));

  constructor(
    private readonly authService: AuthService,
    private readonly crumbService: CrumbService,
    private readonly entityService: EntityService,
    private readonly utilService: UtilService,
    private readonly _dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const getEntitiesByQuery = this.searchValueChanged
      .pipe(
        tap(() => (this.loading = true)),
        debounceTime(500), // wait 500ms after the last event before emitting last event
        distinctUntilChanged(),
        switchMap((value) => this.getEntities(value)),
      ) // only emit if value is different from previous value
      .subscribe((response) => this.source.next(response));

    const getEntities = this.getEntities('').subscribe((response) => this.source.next(response));
    this.subscriptions.add(getEntities);
    this.subscriptions.add(getEntitiesByQuery);
    this.crumbService.setCrumbs(listEntitiesCrumb());
  }

  getEntities(query?: string, parameters?: object): Observable<any> {
    this.loading = true;
    return this.entityService.queryEntities(query, parameters).pipe(
      map((response) => ({
        meta: 'pagination' in response ? response.pagination : null,
        entities: 'result' in response ? response.result : response,
      })),
      map((response) => ({
        ...response,
        // force the page to render as Material would understand it.
        meta: { ...response.meta, page: response.meta.page - 1 },
        entities: [...response.entities].map((entity) => {
          const display = {
            country: entity?.address?.country?.name || entity?.address?.region?.isoAlpha2Code,
            region: entity?.address?.region?.name || entity?.address?.region?.abbreviatedName,
            locality: this.utilService.capitalize(entity?.address?.locality),
          };

          return {
            ...entity,
            address: { ...entity?.address, display },
          };
        }),
      })),
      tap(() => (this.loading = false)),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // events go here...

  onModelChange(value): void {
    this.query = value;
    this.searchValueChanged.next(this.query);
  }

  onPage({ pageIndex, pageSize }): void {
    const getEntities = this.getEntities(this.query, {
      page: pageIndex,
      size: pageSize,
    }).subscribe((response) => this.source.next(response));
    this.subscriptions.add(getEntities);
  }
  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
];

//     BarcodeFormat.QR_CODE,


  qrResultString: string;

  clearResult(): void {
    this.qrResultString = null;
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
  }


}
