import { Component, OnInit } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Router } from '@angular/router';
import { createEntityCrumb } from '@entities/components/create-entity/create-entity.crumb';
import { EntityService } from '@entities/services/entity.service';
import { Entity } from '@entities/models/entity.model';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './create-entity.component.html',
  styleUrls: ['./create-entity.component.scss'],
})
export class CreateEntityComponent implements OnInit {
  subscriptions: Subscription = new Subscription();

  constructor(
    private entityService: EntityService,
    private crumbService: CrumbService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.crumbService.setCrumbs(createEntityCrumb());
  }

  handleSubmit(entity: Entity) {
    this.entityService.saveEntity(entity).subscribe((res) => this.router.navigate(['/entities']));
  }
}
