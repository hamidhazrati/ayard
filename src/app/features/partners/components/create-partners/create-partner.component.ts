import { Component, Input, OnInit } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Router } from '@angular/router';
import { PartnerRequest, PartnerService } from '@app/features/partners/services/partner.service';
import { createPartnerCrumb } from '@app/features/partners/components/create-partners/create-partner.crumb';
import { Control, FormBuilder, FormGroup, Validators, ValidatorsModel } from '@ng-stack/forms';
import { Entity } from '@entities/models/entity.model';
import { serviceValidator } from '@app/shared/validators/service.validator';

@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.scss'],
})
export class CreatePartnerComponent implements OnInit {
  form: FormGroup<PartnershipFields>;

  errors = {
    unique: ({ label, error }) => `${label} is not unique.`,
  };

  @Input()
  serverError?: string;

  constructor(
    private formBuilder: FormBuilder,
    private crumbService: CrumbService,
    private router: Router,
    private partnerService: PartnerService,
  ) {
    this.form = formBuilder.group<PartnershipFields>({
      entity: formBuilder.control(null, Validators.required),
      partnerId: formBuilder.control(null, Validators.required),
      name: formBuilder.control(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.crumbService.setCrumbs(createPartnerCrumb());
  }

  createPartner() {
    this.form.controls.entity.markAsTouched();
    if (!this.form.valid) {
      return;
    }
    const entity = this.form.controls.entity.value;
    const name = this.form.controls.name.value;
    const id = this.form.controls.partnerId.value;
    const partnerRequest: PartnerRequest = {
      name,
      id,
      entityId: entity.id,
    };
    this.partnerService.createPartner(partnerRequest).subscribe(
      (partnerCreated) => {
        this.router.navigate([`/partners`]);
      },
      (err) => {
        this.serverError = 'Error from server';
        if (err.status === 409) {
          err.error.details.forEach((el: any) => {
            if (el.target.includes('id')) {
              this.serverError = 'Partner Id already exists';
            } else if (el.target.includes('name')) {
              this.serverError = 'Partner name already exists';
            } else if (el.target.includes('entityId')) {
              this.serverError = 'Partner already exists for Entity';
            }
          });
        } else if (err.status === 400) {
          err.error.details.forEach((el: any) => {
            this.serverError = el.description;
          });
        }
        console.error(this.serverError, err);
      },
    );
  }

  cancel() {
    this.router.navigate([`/partners`]);
  }
}

class PartnershipFields {
  entity: Control<Entity>;
  partnerId: string;
  name: string;
}
