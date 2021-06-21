import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityTreeViewComponent } from './facility-tree-view.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { FacilityPipe } from '@app/features/facilities/pipes/facility.pipe';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('FacilityTreeViewComponent', () => {
  let component: FacilityTreeViewComponent;
  let fixture: ComponentFixture<FacilityTreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, MatIconModule, MatMenuModule, RouterTestingModule.withRoutes([])],
      declarations: [FacilityTreeViewComponent, FacilityPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
