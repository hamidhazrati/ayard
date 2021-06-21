import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { listEntitiesCrumb } from '@entities/components/list-entities/list-entities.crumb';
import { Entity } from '@entities/models/entity.model';

export const viewEntityCrumb = (entity: Entity): Breadcrumb[] => {
  return [
    ...listEntitiesCrumb(),
    {
      link: `/entities/${entity.id}`,
      title: entity.name,
    },
  ];
};
