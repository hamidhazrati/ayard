import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityComponent, ITreeNode } from './facility.component';
import { FacilityTreeComponent } from '@app/features/facilities/components/facility-tree/facility-tree.component';
import { FacilityTreeViewComponent } from '@app/features/facilities/components/facility-tree-view/facility-tree-view.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FacilityTreeService } from '@app/features/facilities/services/facility-tree.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { FacilityPipe } from '@app/features/facilities/pipes/facility.pipe';

describe('FacilityComponent', () => {
  let component: FacilityComponent;
  let fixture: ComponentFixture<FacilityComponent>;
  let service: FacilityTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTreeModule,
        MatIconModule,
        MatMenuModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [
        FacilityComponent,
        FacilityTreeComponent,
        FacilityTreeViewComponent,
        FacilityPipe,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ exposure: {} }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FacilityComponent);
    component = fixture.componentInstance;
    service = TestBed.get(FacilityTreeService);
    jest.spyOn(service, 'generateTree');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(service.generateTree).toHaveBeenCalled();
    expect(component.dataSource.data).toBeTruthy();
  });

  it('should assign the selected facility', () => {
    const node: ITreeNode = {
      name: 'Switzerland',
      level: 1,
      children: [],
    };
    component.onSelected(node);
    expect(component.facility).toBe(node);
  });

  it('should have the facility assigned upon initialization.', () => {
    fixture.whenStable().then(() => expect(component.facility).toBeTruthy());
  });
});
