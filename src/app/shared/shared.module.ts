import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { HeaderComponent } from '@app/shared/header/header.component';
import { NavigationComponent } from '@app/shared/navigation/navigation.component';
import { FooterComponent } from '@app/shared/footer/footer.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { FormLabelComponent } from './components/form-label/form-label.component';
import { CardSectionComponent } from './components/card/card-section/card-section.component';
import { CardComponent } from './components/card/card.component';
import { FormErrorComponent } from './components/form-error/form-error.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgStackFormsModule } from '@ng-stack/forms';
import { FormValueComponent } from '@app/shared/components/form-value/form-value.component';
import { AdderAnchorComponent } from '@app/shared/components/adder-anchor/adder-anchor.component';
import { SeparatorComponent } from './components/separator/separator.component';
import { ListInputComponent } from './components/list-input/list-input.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { TitleCaseFormatPipe } from '@app/shared/pipe/titlecase-format.pipe';
import { LimitFormFieldComponent } from './components/limit-form-field/limit-form-field.component';
import { UtilService } from '@app/shared/util/util.service';
import { AlertComponent } from '@app/shared/components/alert/alert.component';
import { MatButtonModule } from '@angular/material/button';
import { PluckFromEachPipe } from './pipe/pluckFromEach.pipe';
import { PositiveTwoDecimalDirective } from './input/positive-two-decimal';

const imports = [
  CommonModule,
  RouterModule,
  MatIconModule,
  MatDividerModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatAutocompleteModule,
  NgStackFormsModule,
  MatChipsModule,
  MatRadioModule,
];

export const sharedDeclarations = [
  PositiveTwoDecimalDirective,
  HeaderComponent,
  NavigationComponent,
  FooterComponent,
  BreadcrumbsComponent,
  CardComponent,
  CardSectionComponent,
  FormLabelComponent,
  FormValueComponent,
  FormErrorComponent,
  AdderAnchorComponent,
  SeparatorComponent,
  ListInputComponent,
  TitleCaseFormatPipe,
  LimitFormFieldComponent,
  PluckFromEachPipe,
];

@NgModule({
  declarations: [sharedDeclarations, AlertComponent, PluckFromEachPipe],
  imports: [imports, MatButtonModule],
  exports: [...imports, ...sharedDeclarations, AlertComponent],
  providers: [UtilService],
})
export class SharedModule {}
