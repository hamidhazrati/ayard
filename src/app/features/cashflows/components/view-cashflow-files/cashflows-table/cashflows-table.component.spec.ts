import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { TitleCaseFormatPipe } from '@app/shared/pipe/titlecase-format.pipe';
import { GdsDataTableModule } from '@greensill/gds-ui/data-table';

import { CashflowsTableComponent } from './cashflows-table.component';

describe('CashflowsTableComponent', () => {
  let component: CashflowsTableComponent;
  let fixture: ComponentFixture<CashflowsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTableModule, MatProgressSpinnerModule, GdsDataTableModule],
      declarations: [CashflowsTableComponent, TitleCaseFormatPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
