import { Component, OnInit } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { resolveEntityCrumb } from '@entities/components/resolve-entity/resolve-entity.crumb';
import { EntitySearch } from '@entities/models/entity-search.model';
import { EntityService } from '@entities/services/entity.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { EntitySearchResult } from '../../models/entity-search-result.model';
import { AuthService } from '@app/auth/auth-service';
import { from, Observable } from 'rxjs';
import { BarcodeFormat } from '@zxing/library';

@Component({
  templateUrl: './resolve-entity.component.html',
  styleUrls: ['./resolve-entity.component.scss'],
})
export class ResolveEntityComponent implements OnInit {
  dataSource: MatTableDataSource<EntitySearchResult>;
  displayedColumns: string[] = ['entityName', 'entityIds', 'address', 'confidanceScore', 'status'];
  entitySearchResults: EntitySearchResult[];
  errorMessage = '';
  loading = false;
  showError = false;
  readonly isAllowed$: Observable<boolean> = from(this.authService.isAuthorised('entity:write'));

  constructor(
    private readonly authService: AuthService,
    private readonly crumbService: CrumbService,
    private readonly entityService: EntityService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.crumbService.setCrumbs(resolveEntityCrumb());
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length) {
        const matchCriteria = params as EntitySearch;
        this.search(matchCriteria);
      }
    });
  }

  search(entitySearch: EntitySearch) {
    this.loading = true;
    this.entitySearchResults = [];
    this.entityService.search(entitySearch).subscribe(
      (data: EntitySearchResult[]) => {
        this.router.navigate([], { relativeTo: this.route, queryParams: entitySearch });
        this.entitySearchResults = data;
        this.loading = false;
        this.showError = false;
        this.dataSource = new MatTableDataSource(this.entitySearchResults);
      },
      (error) => {
        this.errorMessage =
          error.status === 400
            ? 'Incorrect search parameters. Please correct and try again.'
            : 'An error has occurred while performing the search operation. Please try again later.';
        this.entitySearchResults = [];
        this.loading = false;
        this.showError = true;
      },
    );
  }

  navigateToViewMatchCandidate(dunsNumber) {
    this.router.navigate([`/entities/matchcandidates/${dunsNumber}`]);
  }

  navigateToEntityDetails(entityId) {
    this.router.navigate([`/entities/${entityId}`]);
  }

  isValuePresent(value) {
    return value && value !== '';
  }

  // ...
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
