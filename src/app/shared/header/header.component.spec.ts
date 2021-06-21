import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { KeycloakService } from 'keycloak-angular';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let keycloakService: Mocked<KeycloakService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [
        {
          provide: KeycloakService,
          useValue: keycloakService = MockService(KeycloakService) as Mocked<KeycloakService>,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN the header is rendered', () => {
    xtest('THEN it should match snapshot', () => {
      // expect(fixture).toMatchSnapshot();
    });
  });
});
