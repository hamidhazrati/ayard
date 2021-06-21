import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Router } from '@angular/router';
import { CounterpartyRoleService } from '@app/features/counterparty-roles/services/counterparty-role.service';
import { CreateCounterpartyRoleComponent } from '@app/features/counterparty-roles/components/create-counterparty-role/create-counterparty-role.component';
import { CreateUpdateCounterpartyRole } from '@app/features/counterparty-roles/models/counterparty.role';
import { CreateCounterpartyRoleFormComponent } from './create-counterparty-role-form/create-counterparty-role-form.component';
import { createCounterpartyRoleCrumb } from './create-counterparty-role.crumb';
import { SharedModule } from '@app/shared/shared.module';
import { MockService, MockComponent, MockHelper } from 'ng-mocks';
import Mocked = jest.Mocked;

describe('CreateCounterpartyRole', () => {
  let component: CreateCounterpartyRoleComponent;
  let fixture: ComponentFixture<CreateCounterpartyRoleComponent>;

  let counterpartyRoleService: Mocked<CounterpartyRoleService>;
  let crumbService: Mocked<CrumbService>;
  let router: Mocked<Router>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatInputModule, SharedModule],
      declarations: [
        CreateCounterpartyRoleComponent,
        MockComponent(CreateCounterpartyRoleFormComponent),
      ],
      providers: [
        {
          provide: CounterpartyRoleService,
          useValue: counterpartyRoleService = MockService(CounterpartyRoleService) as Mocked<
            CounterpartyRoleService
          >,
        },
        {
          provide: CrumbService,
          useValue: crumbService = MockService(CrumbService) as Mocked<CrumbService>,
        },
        { provide: Router, useValue: router = MockService(Router) as Mocked<Router> },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCounterpartyRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN CreateCounterpartyType has been initialised', () => {
    test('THEN it should set breadcrumbs', () => {
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(createCounterpartyRoleCrumb());
    });
  });

  describe('GIVEN a Counterparty role is created', () => {
    test('THEN it should redirect to the Entity List', () => {
      const value: CreateUpdateCounterpartyRole = {
        name: 'name',
        description: 'description',
        required: false,
      };

      counterpartyRoleService.saveCounterpartyRole.mockImplementation((roleType) => {
        expect(roleType).toBe(value);
        return of({ id: '1' });
      });

      const eventEmitter = MockHelper.findOrFail(
        fixture.debugElement,
        CreateCounterpartyRoleFormComponent,
      ).componentInstance.save;

      eventEmitter.emit(value);

      expect(counterpartyRoleService.saveCounterpartyRole).toHaveBeenCalledWith(value);
      expect(router.navigate).toHaveBeenCalledWith(['/counterparty-roles/1']);
    });
  });
});
