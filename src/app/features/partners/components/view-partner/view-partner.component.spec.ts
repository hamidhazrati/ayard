import { CrumbService } from '@app/services/crumb/crumb.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MockService } from 'ng-mocks';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from '@app/shared/shared.module';
import { ViewPartnerComponent } from '@app/features/partners/components/view-partner/view-partner.component';
import { PartnerService } from '@app/features/partners/services/partner.service';
import { viewPartnerCrumb } from '@app/features/partners/components/view-partner/view-partner.crumb';

const partnerId = 'ID';
const samplePartner = {
  id: 'ID',
  name: 'Entity 1',
  entityId: 'Entity1',
};

describe('ViewPartnerComponent', () => {
  let component: ViewPartnerComponent;

  let crumbService;
  let partnerService;
  let fixture: ComponentFixture<ViewPartnerComponent>;

  beforeEach(() => {
    crumbService = new CrumbService();

    TestBed.configureTestingModule({
      declarations: [ViewPartnerComponent],
      imports: [HttpClientTestingModule, MatCardModule, MatListModule, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: partnerId }) } },
        },
        { provide: PartnerService, useValue: partnerService = MockService(PartnerService) },
        { provide: CrumbService, useValue: crumbService = MockService(CrumbService) },
        HttpClientTestingModule,
      ],
    });

    fixture = TestBed.createComponent(ViewPartnerComponent);
    component = fixture.componentInstance;
  });

  describe('GIVEN ViewPartnerComponent is initialised', () => {
    test('THEN the crumbservice should be called', () => {
      partnerService.getPartnerById.mockReturnValue(of(samplePartner));
      component.ngOnInit();
      fixture.detectChanges();
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(viewPartnerCrumb(samplePartner));
    });

    test('THEN the partner details should be set', () => {
      partnerService.getPartnerById.mockReturnValue(of(samplePartner));
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.partner).toEqual(samplePartner);
    });
  });
});
