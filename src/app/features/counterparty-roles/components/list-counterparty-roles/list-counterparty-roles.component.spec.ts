import { CrumbService } from '@app/services/crumb/crumb.service';
import { ComponentFixture, fakeAsync, TestBed, tick, async } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ListCounterpartyRolesComponent } from '@app/features/counterparty-roles';
import { CounterpartyRoleService } from '@app/features/counterparty-roles/services/counterparty-role.service';
import { counterPartyRolesCrumb } from '@app/features/counterparty-roles/counter-party-roles.crumb';
import { CounterpartyRole } from '@app/features/counterparty-roles/models/counterparty.role';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@app/shared/shared.module';
import { getByTestId } from '@app/shared/utils/test';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;

describe('ListCounterpartyRolesComponent', () => {
  let component: ListCounterpartyRolesComponent;
  let fixture: ComponentFixture<ListCounterpartyRolesComponent>;

  let crumbService: Mocked<CrumbService>;
  let counterpartyRoleService: Mocked<CounterpartyRoleService>;

  const crts: CounterpartyRole[] = [
    { id: '1', name: 'Buyer', description: 'Buyer Desc', required: false },
    { id: '2', name: 'Seller', description: 'Seller Desc', required: true },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListCounterpartyRolesComponent],
      imports: [
        FormsModule,
        MatInputModule,
        MatTableModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
        SharedModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: CrumbService,
          useValue: crumbService = MockService(CrumbService) as Mocked<CrumbService>,
        },
        {
          provide: CounterpartyRoleService,
          useValue: counterpartyRoleService = MockService(CounterpartyRoleService) as Mocked<
            CounterpartyRoleService
          >,
        },
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    counterpartyRoleService.getCounterpartyRoles.mockReturnValue(of([]));

    fixture = TestBed.createComponent(ListCounterpartyRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    counterpartyRoleService.getCounterpartyRoles.mockClear();
  });

  describe('GIVEN the component has been initialised', () => {
    test('THEN it should set breadcrumbs', () => {
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(counterPartyRolesCrumb());
    });

    test('THEN it should initialise with list of entities', () => {
      counterpartyRoleService.getCounterpartyRoles.mockReturnValue(of(crts));

      component.ngOnInit();

      expect(component.counterpartyRoles).toEqual(crts);
    });
  });

  describe('GIVEN a search for an entity', () => {
    test('THEN it causes a new search', fakeAsync(() => {
      counterpartyRoleService.getCounterpartyRoles.mockReturnValue(of(crts));
      component.ngOnInit();

      const searchText = 'abcde';
      const searchInput = getByTestId(fixture, 'search-input');
      searchInput.nativeElement.value = searchText;
      fixture.detectChanges();
      searchInput.nativeElement.dispatchEvent(new Event('input'));
      component.checkSearchField(searchText);
      fixture.detectChanges();
      tick(400);
      expect(counterpartyRoleService.getCounterpartyRoles).toHaveBeenCalledWith(searchText);
    }));
  });
});
