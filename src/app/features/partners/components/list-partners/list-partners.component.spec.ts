import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MockService } from 'ng-mocks';
import { SharedModule } from '@app/shared/shared.module';
import { ListPartnerComponent } from '@app/features/partners/components/list-partners/list-partners.component';
import { PartnerService } from '@app/features/partners/services/partner.service';
import { Partner } from '@app/features/partners/model/partner.model';
import { listPartnersCrumb } from '@app/features/partners/components/list-partners/list-partners.crumb';
import Mocked = jest.Mocked;
import { Page } from '@app/shared/pagination';
import { LayoutService } from '@app/core/services/layout.service';
import { GdsDataTableModule } from '@greensill/gds-ui/data-table';

describe('ListPartnersComponent', () => {
  let component: ListPartnerComponent;
  let fixture: ComponentFixture<ListPartnerComponent>;

  let crumbService: Mocked<CrumbService>;
  let partnerService: Mocked<PartnerService>;
  let layoutService: Mocked<LayoutService>;

  const partners: Partner[] = [
    {
      id: 'UUIDofPartner1',
      name: 'Entity 1',
      entityId: 'Entity 1',
    },
    {
      id: 'UUIDofPartner2',
      name: 'Entity 2',
      entityId: 'Entity 2',
    },
  ];

  const page: Page<Partner> = {
    data: partners,
    meta: {
      paged: {
        size: 2,
        page: 0,
        totalPages: 1,
        pageSize: 10,
        totalSize: 2,
      },
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListPartnerComponent],
      imports: [
        FormsModule,
        MatInputModule,
        MatTableModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
        SharedModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
        HttpClientTestingModule,
        GdsDataTableModule,
      ],
      providers: [
        {
          provide: CrumbService,
          useValue: crumbService = MockService(CrumbService) as Mocked<CrumbService>,
        },
        {
          provide: PartnerService,
          useValue: partnerService = MockService(PartnerService) as Mocked<PartnerService>,
        },
        {
          provide: LayoutService,
          useValue: layoutService = MockService(LayoutService) as Mocked<LayoutService>,
        },
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    partnerService.getPartners.mockReturnValue(of(page));

    fixture = TestBed.createComponent(ListPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    partnerService.getPartners.mockClear();
  });

  describe('GIVEN the component has been initialised', () => {
    test('THEN it should set breadcrumbs', () => {
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(listPartnersCrumb());
    });

    test('THEN it should set hide body grid', () => {
      expect(layoutService.showBodyGrid).toHaveBeenCalledWith(false);
    });

    test('THEN it should initialise with list of partners', () => {
      partnerService.getPartners.mockReturnValue(of(page));

      component.ngOnInit();

      expect(component.rows).toEqual(partners);
    });
  });
});
