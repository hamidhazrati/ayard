import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WriteGuard } from '@entities/guards/write/write.guard';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth-service';

describe('WriteGuard', () => {
  let guard: WriteGuard;
  let router: Router;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        WriteGuard,
        {
          provide: AuthService,
          useValue: {
            isAuthorised(scope: string) {
              return new Promise((resolve) => resolve(true));
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl(url: string) {
              return new Promise((resolve) => resolve(true));
            },
          },
        },
      ],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    guard = TestBed.inject(WriteGuard);
  });

  it('should initialize.', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to another route if user is not authorised.', async () => {
    jest
      .spyOn(authService, 'isAuthorised')
      .mockReturnValue(new Promise((resolve) => resolve(false)));
    jest.spyOn(router, 'navigateByUrl');
    const redirected = await guard.canActivate().toPromise();
    expect(redirected).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalled();
    expect(authService.isAuthorised).toHaveBeenCalledWith('entity:write');
  });

  it('should redirect to the expected page.', async () => {
    const redirected = await guard.canActivate().toPromise();
    expect(redirected).toBe(true);
  });
});
