import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbsComponent } from './breadcrumbs.component';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BreadcrumbsComponent],
    }).compileComponents();
  }));

  describe('GIVEN a breadcrumb is provided', () => {
    test('THEN it should render the link', () => {
      fixture = TestBed.createComponent(BreadcrumbsComponent);
      component = fixture.componentInstance;
      component.breadcrumbs = [
        {
          link: '/link',
          title: 'Link Me',
        },
      ];
      fixture.detectChanges();

      const breadcrumbs = fixture.nativeElement;
      const li = breadcrumbs.querySelector('li');

      expect(li.innerHTML).toContain('/link');
      expect(li.textContent).toBe('Link Me');
    });
  });
});
