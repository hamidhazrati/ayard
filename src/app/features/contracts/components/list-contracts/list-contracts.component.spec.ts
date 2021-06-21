import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListContractsComponent } from './list-contracts.component';
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
import { listContractsCrumb } from './list-contracts.crumb';
import { ContractService } from '../../services/contract.service';
import { of } from 'rxjs';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;
import { SharedModule } from '@app/shared/shared.module';
import { MatSortModule } from '@angular/material/sort';
import { Contract } from '@app/features/contracts/models/contract.model';
import { GdsDataTableModule } from '@greensill/gds-ui/data-table';

describe('ListContractsComponent', () => {
  let component: ListContractsComponent;
  let fixture: ComponentFixture<ListContractsComponent>;

  let crumbService: Mocked<CrumbService>;
  let contractService: Mocked<ContractService>;

  const contracts: Contract[] = [
    {
      productCategoryName: '',
      productCategoryId: '',
      productName: '',
      id: '180afbb9-91e5-42e5-9c1b-9474bbce691c',
      name: 'B Coupa contract',
      channelReference: '123',
      partnerId: 'COUPA-PARTNER-1',
      status: 'ACTIVE',
      productId: 'SCF_123',
      product: 'SCF',
      created: null,
      rules: [],
      currencies: null,
      bypassTradeAcceptance: false,
    },
    {
      productCategoryName: '',
      productCategoryId: '',
      productName: '',
      id: '5eecc3f38eb2332ddb890461',
      name: 'A Coupa contract 2',
      channelReference: '1234',
      partnerId: 'COUPA-PARTNER-2',
      status: 'ACTIVE',
      productId: 'SCF_123',
      product: 'SCF',
      created: null,
      rules: [],
      currencies: null,
      bypassTradeAcceptance: true,
    },
  ];

  const page = {
    data: contracts,
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
      declarations: [ListContractsComponent],
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
        MatSortModule,
        GdsDataTableModule,
      ],
      providers: [
        {
          provide: CrumbService,
          useValue: crumbService = MockService(CrumbService) as Mocked<CrumbService>,
        },
        {
          provide: ContractService,
          useValue: contractService = MockService(ContractService) as Mocked<ContractService>,
        },
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    contractService.getContracts.mockReturnValue(of(page));

    fixture = TestBed.createComponent(ListContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    contractService.getContracts.mockClear();
  });

  describe('GIVEN the component has been initialised', () => {
    test('THEN it should set breadcrumbs', () => {
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(listContractsCrumb());
    });

    test('THEN it should initialise with list of contracts', () => {
      contractService.getContracts.mockReturnValue(of(page));

      component.ngOnInit();

      expect(component.rows).toEqual(contracts);
    });

    test('THEN contracts should be displayed in ascending order', () => {
      contractService.getContracts.mockReturnValue(of(page));

      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.rows.length).toBe(2);
        expect(component.rows).toBe(page.data);
      });
    });
  });

  describe('GIVEN the component has been initialised', () => {
    xtest('THEN it should match the snapshot', () => {
      // expect(fixture).toMatchSnapshot();
    });
  });
});
