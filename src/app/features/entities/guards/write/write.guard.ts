import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@app/auth/auth-service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WriteGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(): Observable<boolean> {
    return from(this.authService.isAuthorised('entity:write')).pipe(
      map((result) => {
        if (!result) {
          this.router.navigateByUrl('/error');
          return false;
        }

        return true;
      }),
    );
  }
}
