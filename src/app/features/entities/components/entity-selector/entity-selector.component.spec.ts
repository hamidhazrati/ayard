import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitySelectorComponent } from './entity-selector.component';
import { SharedModule } from '@app/shared/shared.module';
import { EntityService } from '@entities/services/entity.service';
import { MockService } from 'ng-mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EntitySelectorComponent', () => {
  let component: EntitySelectorComponent;
  let entityService: EntityService;
  let fixture: ComponentFixture<EntitySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntitySelectorComponent],
      imports: [SharedModule, NoopAnimationsModule],
      providers: [{ provide: EntityService, useValue: entityService = MockService(EntityService) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN the component is initialised', () => {
    test('THEN it should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
