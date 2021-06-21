import { Component, OnInit, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { FormControl } from '@ng-stack/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CalendarService } from '@app/services/calendar/calendar.service';

type OnChange = (calendars: string[]) => void;

const DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CalendarSelectorComponent),
  multi: true,
};

@Component({
  selector: 'app-calendar-selector',
  templateUrl: './calendar-selector.component.html',
  providers: [DEFAULT_VALUE_ACCESSOR],
})
export class CalendarSelectorComponent implements ControlValueAccessor {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  calendarInputControl = new FormControl();
  filteredCalendars: Observable<string[]>;
  selectedCalendars: string[] = [];
  allCalendars: string[] = [];

  @ViewChild('calendarInput') calendarInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  private onTouched: () => void = () => {};
  private onChange: OnChange = () => {};

  constructor(private calendarService: CalendarService) {
    this.calendarService.getCalendars().subscribe((calendars) => {
      this.allCalendars = calendars.map((c) => c.reference);
    });

    this.filteredCalendars = this.calendarInputControl.valueChanges.pipe(
      map((calendar: string | null) =>
        calendar ? this._filter(calendar) : this.allCalendars.slice(),
      ),
    );
  }

  remove(calendar: string): void {
    const index = this.selectedCalendars.indexOf(calendar);

    if (index >= 0) {
      this.selectedCalendars.splice(index, 1);
    }

    this.onChange(this.selectedCalendars);
  }

  selected(value: string): void {
    this.calendarInput.nativeElement.value = '';
    this.calendarInputControl.setValue(null);
    if (!this.selectedCalendars.includes(value)) {
      this.selectedCalendars.push(value);
      this.onChange(this.selectedCalendars);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCalendars.filter(
      (calendar) => calendar.toLowerCase().indexOf(filterValue) === 0,
    );
  }

  writeValue(value: string[]): void {
    this.selectedCalendars = Array.isArray(value) ? [...value] : [];
  }
  registerOnChange(onChange: OnChange): void {
    this.onChange = onChange;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.selectable = !isDisabled;
    this.removable = !isDisabled;
  }
}
