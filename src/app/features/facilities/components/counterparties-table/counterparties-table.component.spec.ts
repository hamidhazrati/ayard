import { CounterpartiesTableComponent } from '@app/features/facilities/components/counterparties-table/counterparties-table.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UtilService } from '@app/shared/util/util.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CounterpartiesTableComponent', () => {
  let component: CounterpartiesTableComponent;
  let fixture: ComponentFixture<CounterpartiesTableComponent>;
  let utilService: UtilService;

  const response = [
    {
      duns: 'JTA',
      creditAvailable: 9996986,
      creditLimit: 10000000,
      currency: 'USD',
      facilityExposure: 3014,
      insuranceAvailable: NaN,
      insuranceLimit: NaN,
      insuranceLimitType: '',
      name: 'JT-Affiliate',
      rawValue: {},
    },
    {
      creditAvailable: 355162.88,
      creditLimit: 10000000,
      currency: 'USD',
      duns: null,
      facilityExposure: 9644837.12,
      insuranceAvailable: NaN,
      insuranceLimit: NaN,
      insuranceLimitType: '',
      name: 'Bojo Cycles',
      rawValue: {},
    },
  ];

  const source = [
    {
      classification: {
        type: 'entity',
        id: '2',
        name: 'JT-Affiliate',
        dunsNumber: 'JTA',
      },
      results: [
        {
          classification: {
            type: 'entity',
            id: '2',
            name: 'JT-Affiliate',
            dunsNumber: 'JTA',
          },
          currency: 'USD',
          total: 10000000,
          used: 3014,
          available: 9996986,
          balance: {
            currency: 'USD',
            provisionalInvestment: 0,
            earmarkedInvestment: 3014,
            investment: 0,
            maturity: 0,
            earmarkedMaturity: 0,
            provisionalMaturity: 0,
            lockedInvestment: 3014,
            lockedMaturity: 0,
          },
          limit: {
            type: 'total-limit',
            limit: 10000000,
            limitType: 'CREDIT',
            defaultLimit: true,
            exceptionCode: 'CREDIT',
          },
          breached: false,
          ok: true,
        },
      ],
      creditResult: {
        classification: {
          type: 'entity',
          id: '2',
          name: 'AT-Affiliate',
          dunsNumber: 'JTA',
        },
        currency: 'USD',
        total: 10000000,
        used: 3014,
        available: 9996986,
        balance: {
          currency: 'USD',
          provisionalInvestment: 0,
          earmarkedInvestment: 3014,
          investment: 0,
          maturity: 0,
          earmarkedMaturity: 0,
          provisionalMaturity: 0,
          lockedInvestment: 3014,
          lockedMaturity: 0,
        },
        limit: {
          type: 'total-limit',
          limit: 10000000,
          limitType: 'CREDIT',
          defaultLimit: true,
          exceptionCode: 'CREDIT',
        },
        breached: false,
        ok: true,
      },
      used: 3014,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatTableModule,
      ],
      declarations: [CounterpartiesTableComponent],
    });

    fixture = TestBed.createComponent(CounterpartiesTableComponent);
    component = fixture.componentInstance;
    utilService = TestBed.inject(UtilService);
    component.source = source;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the first item in the list', () => {
    const list = [
      { id: 'name', label: 'Entity' },
      { id: 'duns', label: 'DUNS' },
      { id: 'currency', label: 'CCY' },
    ];
    expect(component.first(list)).toBe(list[0]);
  });

  it('should inform me of negative number', () => {
    jest.spyOn(utilService, 'isNegative');
    expect(component.isNegative(12)).toBe(false);
    expect(component.isNegative(-1)).toBe(true);
    expect(utilService.isNegative).toHaveBeenCalledTimes(2);
  });

  it('should emit and populate the behavior subject accordingly.', () => {
    component.source = source;
    jest.spyOn(component.dataSource, 'next');
    component.initializeData();
    expect(component.dataSource.next).toHaveBeenCalled();
  });

  it('should toggle page accordingly with the correct details', () => {
    const toggleInfo = {
      pageIndex: 1,
      pageSize: 25,
    };

    jest.spyOn(component.dataSource, 'next');
    component.onPageToggle(toggleInfo);
    expect(component.dataSource.next).toHaveBeenCalled();
  });

  it('should only change "data" if this is a search', () => {
    jest.spyOn(component.dataSource, 'next');
    component.search = 'University';
    component.onPageToggle({ pageSize: 25, pageIndex: 2 });
    expect(component.dataSource.next).toHaveBeenCalled();
  });

  it('should make changes to dataSource', () => {
    jest.spyOn(component.dataSource, 'next');
    jest.spyOn(component, 'mapData');
    component.onValueChange('University');
    expect(component.dataSource.next).toHaveBeenCalled();
  });

  it('should change "orderBy" to "desc"', () => {
    jest.spyOn(component.dataSource, 'next');
    const [entityName] = component.columnList;
    component.onFilterClick(entityName);
    expect(entityName.orderBy).toBe('asc');
    expect(component.dataSource.next).toHaveBeenCalled();
  });

  it('should change "orderBy" to "asc"', () => {
    const [entityName] = component.columnList;
    entityName.orderBy = 'desc';
    component.onFilterClick(entityName);
    expect(entityName.orderBy).toBe('asc');
  });

  it('should not update observable state', () => {
    jest.spyOn(component.dataSource, 'next');
    const [_, duns] = component.columnList;
    component.onFilterClick(duns);
    expect(component.dataSource.next).toHaveBeenCalledTimes(0);
  });

  it('should order data accordingly', () => {
    const [a, b] = response;
    const [entityName] = component.columnList;
    const items = { a, b };
    component.orderData(items, entityName);
    expect(component.orderData(items, entityName)).toBe(-1);
  });
});
