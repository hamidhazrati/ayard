import { Component, OnInit, OnDestroy } from '@angular/core';
import { EntityService } from '@entities/services/entity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { viewMatchCandidateCrumb } from './view-matchcandidate.crumb';
import { EntityMatchCandidate } from '../../models/entity-match-candidate.model';
import { EntitySearch } from '../../models/entity-search.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  templateUrl: './view-matchcandidate.component.html',
  styleUrls: ['./view-matchcandidate.component.scss'],
})
export class ViewMatchCandidateComponent implements OnInit, OnDestroy {
  public loading = true;
  showError = false;
  errorMessage = '';

  public entityMatchCandidate: EntityMatchCandidate;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private entityService: EntityService,
    private crumbService: CrumbService,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.entityService
      .search({ dunsNumber: id } as EntitySearch)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: EntityMatchCandidate[]) => {
        this.entityMatchCandidate = data?.[0];
        this.loading = false;
        this.crumbService.setCrumbs(viewMatchCandidateCrumb(this.entityMatchCandidate));
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  createEntity(dunsNumber) {
    this.loading = true;
    this.entityService
      .createFromDuns(dunsNumber)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (entity) => {
          this.loading = false;
          this.showError = false;
          this.router.navigate([`/entities/${entity.id}`], {
            state: { createdStatus: 'new' },
          });
        },
        (error) => {
          console.error(error);
          this.loading = false;
          this.showError = true;
          this.errorMessage = 'Error has occured while creating new entity.';
        },
      );
  }

  cancel() {
    this.location.back();
  }

  get regionNameIfNotRegionCode() {
    const regionName = this.entityMatchCandidate.primaryAddress.regionName;
    if (!regionName) {
      return this.entityMatchCandidate.primaryAddress.region;
    }
    return regionName;
  }
}
