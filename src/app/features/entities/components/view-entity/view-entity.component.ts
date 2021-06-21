import { Component, OnInit } from '@angular/core';
import { EntityService } from '@entities/services/entity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { viewEntityCrumb } from './view-entity.crumb';
import { Entity } from '@entities/models/entity.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, pluck, switchMap } from 'rxjs/operators';
import { AlertAction } from '@app/shared/model/model-helpers';
import { MatDialog } from '@angular/material/dialog';
import { EntityDialogueComponent } from '@entities/components/entity-dialogue/entity-dialogue.component';
import { EntityHistoryComponent } from '@entities/components/entity-history/entity-history.component';
import { Location } from '@angular/common';
import { AuthService } from '@app/auth/auth-service';
import { forkJoin, from, Observable, of } from 'rxjs';

@Component({
  templateUrl: './view-entity.component.html',
  styleUrls: ['./view-entity.component.scss'],
})
export class ViewEntityComponent implements OnInit {
  isAuthorised$: Observable<any>;

  loading = true;
  entity: Entity;
  newlyCreatedEntity = false;
  showAlert = true;
  showHistoryButton = false;

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly entityService: EntityService,
    private readonly crumbService: CrumbService,
    private readonly location: Location,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {
    this.newlyCreatedEntity =
      this.router.getCurrentNavigation().extras.state?.createdStatus === 'new';
    if (this.newlyCreatedEntity) {
      this.snackBar.open('New entity created.', null, {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.route.params
      .pipe(
        pluck('id'),
        switchMap((entityId: string) => this.entityService.getEntityById(entityId)),
      )
      .subscribe(
        (data: Entity) => {
          this.entity = data;
          this.showAlert = this.entity && this.entity.status === 'AWAITING_APPROVAL';
          this.crumbService.setCrumbs(viewEntityCrumb(data));
          this.loading = false;

          this.isAuthorised$ = forkJoin({
            isAuthorised: from(this.authService.isAuthorised('entity:approve')),
            username: from(this.authService.getUserName()),
          }).pipe(
            map(({ isAuthorised, username }) =>
              isAuthorised ? isAuthorised && username !== this.entity.createdBy : false,
            ),
          );
        },
        ({ status }) => {
          // if this cannot be found, redirect
          if (status === 404) {
            return this.snackBar
              .open('Entity not found.', null, { duration: 2000 })
              .afterDismissed()
              .subscribe(() => this.location.back());
          }
        },
      );
  }

  getEntity() {
    return this.entity;
  }

  get regionNameIfNotRegionCode() {
    const regionName = this.entity.address.regionName;
    if (!regionName) {
      return this.entity.address.region;
    }
    return regionName;
  }

  get registeredAddressRegionNameIfNotRegionCode() {
    const regionName = this.entity.registeredAddress.regionName;
    if (!regionName) {
      return this.entity.registeredAddress.region;
    }
    return regionName;
  }

  checkIfNaicsCodesPresent(industryCodes) {
    return (
      industryCodes.filter((code) => {
        return (
          code.typeDescription &&
          code.typeDescription
            .toLowerCase()
            .indexOf('north american industry classification system') !== -1
        );
      }).length > 0
    );
  }

  isNAICS(typeDescription) {
    return (
      typeDescription &&
      typeDescription.toLowerCase().indexOf('north american industry classification system') !== -1
    );
  }

  isRegisteredAddressHasValues(registeredAddress) {
    return (
      registeredAddress &&
      Object.keys(registeredAddress).every((property) => {
        return registeredAddress[property];
      })
    );
  }

  // events go here ------------------------------------------------------------------------

  onActioned(action: AlertAction): void {
    this.dialog
      .open(EntityDialogueComponent, {
        data: action,
        height: 'auto',
        maxWidth: '500px',
        width: '100%',
      })
      .afterClosed()
      .pipe(
        switchMap((response) => {
          return response.action === 'approved'
            ? this.entityService.approveEntity(this.entity.id)
            : response.action === 'rejected'
            ? this.entityService.rejectEntity(this.entity.id)
            : of('cancel');
        }),
      )
      .subscribe(
        (response) => {
          if (response === 'cancel') {
            return;
          }

          if (action === 'rejected') {
            return this.location.back();
          }

          this.entity.status = 'ACTIVE';
          this.showAlert = !this.showAlert;
          return this.snackBar.open('Entity approved.', '', {
            duration: 2000,
            panelClass: 'snackbar',
            verticalPosition: 'top',
          });
        },
        (err) => console.error(err),
      );
  }

  onClosed(): void {
    this.showAlert = false;
  }

  onHistoryView(): void {
    this.dialog.open(EntityHistoryComponent, {
      data: {},
      position: { right: '0' },
      height: '100%',
      width: '500px',
      hasBackdrop: false,
      panelClass: 'sidebar',
    });
  }
}
