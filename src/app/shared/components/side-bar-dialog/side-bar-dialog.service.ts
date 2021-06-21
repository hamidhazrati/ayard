import { Injectable, TemplateRef, ComponentFactoryResolver, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { NavigationStart, Router } from '@angular/router';
import { SideBarDialogRef } from '@app/shared/components/side-bar-dialog/side-bar-dialog-ref.model';

@Injectable({
  providedIn: 'root',
})
export class SideBarDialogService {
  constructor(private dialog: MatDialog, private router: Router) {
    this.router.events?.subscribe((e) => {
      if (e instanceof NavigationStart) {
        this.dialog.closeAll();
      }
    });
  }

  open<T, D, R>(
    component: ComponentType<T> | TemplateRef<T>,
    data?: D,
    width?: number,
  ): SideBarDialogRef<T, R> {
    this.dialog.closeAll();

    return this.dialog.open<T, D, R>(component, {
      data,
      position: { right: '0' },
      height: '100%',
      width: width ? width + 'px' : '900px',
      hasBackdrop: false,
      panelClass: 'sidebar',
    });
  }
}
