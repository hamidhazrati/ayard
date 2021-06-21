import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityTreeComponent } from './facility-tree.component';
import { ITreeNode } from '@app/features/facilities/components/facility/facility.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

describe('FacilityTreeComponent', () => {
  let component: FacilityTreeComponent;
  let fixture: ComponentFixture<FacilityTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTreeModule, MatIconModule],
      declarations: [FacilityTreeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityTreeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the "whenSelected" event with the selected node', () => {
    jest.spyOn(component.whenSelected, 'emit');
    const node: ITreeNode = {
      name: 'Switzerland',
      level: 1,
      children: [],
    };
    component.onClick(node);
    expect(component.whenSelected.emit).toHaveBeenCalledWith(node);
  });

  it('should render correctly (if it has children)', () => {
    const node = {
      children: [],
    } as ITreeNode;

    expect(component.hasChild(1, node)).toBe(0);
  });
});
