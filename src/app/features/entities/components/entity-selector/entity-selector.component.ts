import {
  AfterViewInit,
  Component,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EntityService } from '@entities/services/entity.service';
import { Entity } from '@entities/models/entity.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { FormControl } from '@ng-stack/forms';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Address, formatAddress } from '../../models/address.model';

const DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EntitySelectorComponent),
  multi: true,
};

type OnChange = (entity: Entity) => void;

export const MIN_ENTITY_LOOKUP_LENGTH = 3;

const isString = (v?: string | Entity): v is string => v?.constructor === String;

@Component({
  selector: 'app-entity-selector',
  templateUrl: './entity-selector.component.html',
  styleUrls: ['./entity-selector.component.scss'],
  providers: [DEFAULT_VALUE_ACCESSOR],
})
export class EntitySelectorComponent
  implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {
  @Input()
  hint: string;

  @Input()
  disabled = false;

  @Input()
  inputId: string;

  @Input()
  debounceTime = 300;

  @Input()
  required: boolean;

  @ViewChild('auto')
  auto: MatAutocomplete;

  formatAddress = formatAddress;

  private control: FormControl;
  private value?: Entity;
  private subscriptions: Subscription[] = [];

  entities: Observable<Entity[]> = of([]);

  readonly form = new FormControl<string | Entity>();

  private onTouched: () => void = () => {};
  private onChange: OnChange = () => {};

  constructor(private injector: Injector, private entityService: EntityService) {}

  ngOnInit(): void {
    this.entities = this.form.valueChanges.pipe(
      filter((v) => {
        if (!v) {
          this.writeValue(null);
        }

        if (!isString(v)) {
          this.value = v as Entity;
          return false;
        }

        return true;
      }),
      debounceTime(this.debounceTime),
      switchMap((value: string) => {
        if (value.length < MIN_ENTITY_LOOKUP_LENGTH) {
          return of<Entity[]>([]);
        }

        return this.entityService.getEntities(value);
      }),
    );
  }

  ngAfterViewInit() {
    const ngControl: NgControl = this.injector.get(NgControl, null);

    if (ngControl) {
      this.control = ngControl.control as FormControl;
    }

    this.subscriptions.push(
      this.auto.closed.subscribe((e) => {
        if (!e || !e.source) {
          const selected = this.auto.options
            .map((option) => option.value)
            .find((option) => option === this.form.value);

          if (!selected) {
            this.form.reset();
          } else {
            this.writeValue(this.value);
          }
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  registerOnChange(onChange: OnChange): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: Entity): void {
    this.value = value;
    this.onChange(this.value);
  }

  displayFn(entity: Entity) {
    return entity?.name || '';
  }
}
