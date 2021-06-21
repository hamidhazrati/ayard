import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DashboardComponent } from './dashboard.component';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { dashboardCrumb } from '@app/features/dashboard/dashboard.crumb';
import { SharedModule } from '@app/shared/shared.module';

describe('DashboardComponent', () => {
  let spy: any;
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const crumbService: CrumbService = new CrumbService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [RouterTestingModule, SharedModule],
      providers: [{ provide: CrumbService, useValue: crumbService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise crumbs', () => {
    spy = jest.spyOn(crumbService, 'setCrumbs');
    component.ngOnInit();

    const crumbs = dashboardCrumb();
    delete crumbs[0].link;

    expect(crumbService.setCrumbs).toHaveBeenCalledWith(crumbs);
  });
});
