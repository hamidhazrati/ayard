import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterpartyRoleListComponent } from './counterparty-role-list.component';
import { MatListModule } from '@angular/material/list';
import { CounterpartyRoleService } from '@app/features/counterparty-roles/services/counterparty-role.service';
import { of } from 'rxjs';
import { MockService } from '@app/shared/utils/test/mock';
import Mocked = jest.Mocked;

describe('CounterpartyRoleListComponent', () => {
  let component: CounterpartyRoleListComponent;
  let fixture: ComponentFixture<CounterpartyRoleListComponent>;
  let service: Mocked<CounterpartyRoleService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CounterpartyRoleListComponent],
      imports: [MatListModule],
      providers: [
        {
          provide: CounterpartyRoleService,
          useValue: service = MockService(CounterpartyRoleService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    service.getCounterpartyRoles.mockReturnValue(of([]));

    fixture = TestBed.createComponent(CounterpartyRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN the component is instantiated', () => {
    test('THEN it should instantiate correctly', () => {
      expect(component).toBeTruthy();
    });
  });
});
