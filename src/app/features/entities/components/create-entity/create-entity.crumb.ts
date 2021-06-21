import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { listEntitiesCrumb } from '@entities/components/list-entities/list-entities.crumb';

export const createEntityCrumb = (): Breadcrumb[] => {
  return [
    ...listEntitiesCrumb(),
    {
      link: `/entities/new`,
      title: 'Create new entity',
    },
  ];
};
