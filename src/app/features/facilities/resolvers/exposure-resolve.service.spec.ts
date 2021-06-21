import { TestBed } from '@angular/core/testing';

import { ExposureResolveService } from './exposure-resolve.service';
import { ExposureService } from '@app/features/facilities/services/exposure.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ParamMap, RouterStateSnapshot } from '@angular/router';

describe('ExposureResolveService', () => {
  let service: ExposureResolveService;
  let exposureService: ExposureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExposureService, ExposureResolveService],
    });
    service = TestBed.inject(ExposureResolveService);
    exposureService = TestBed.inject(ExposureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send the correct request.', () => {
    jest.spyOn(exposureService, 'getFacility');
    const route = {
      paramMap: {
        get(name: string) {
          return name;
        },
      },
    } as ActivatedRouteSnapshot;

    service.resolve(route);
    expect(exposureService.getFacility).toHaveBeenCalledWith(route.paramMap.get('id'));
  });
});
