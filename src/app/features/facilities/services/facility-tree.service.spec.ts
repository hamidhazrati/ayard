import { TestBed } from '@angular/core/testing';

import { FacilityTreeService } from './facility-tree.service';
import { ViewProjection } from '@app/features/facilities/components/view-facility/view-facility.component';
import { Subscription } from 'rxjs';

describe('FacilityTreeService', () => {
  // necessary to unsubscribe "subscriptions" in tests
  const subscriptions = new Subscription();
  let service: FacilityTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacilityTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should bring back tree structure', () => {
    const projection = {
      facility: { name: 'Vodafone' },
      exposure: {},
      children: [],
    } as ViewProjection;

    // add to subscription in order to be unsubscribed from.
    const generateTree = service.generateTree(projection).subscribe((result) => {
      expect(result).toBeTruthy();
      expect(result.name).toEqual(projection.facility.name);
    });

    subscriptions.add(generateTree);
  });

  afterAll(() => {
    subscriptions.unsubscribe();
  });
});
