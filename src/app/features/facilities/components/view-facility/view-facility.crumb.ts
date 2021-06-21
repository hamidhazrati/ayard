import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { Facility } from '@app/features/facilities/models/facility.model';
import { listFacilitiesCrumb } from '@app/features/facilities/components/list-facilities/list-facilities.crumb';
import { FacilityProjection } from '@app/features/facilities/models/facility-projection.model';

export const viewFacilityCrumb = (projection: FacilityProjection): Breadcrumb[] => {
  return [
    ...listFacilitiesCrumb(),
    {
      link: `/facilities/${projection.facility.id}`,
      title: `${projection.facility.name}`,
    },
  ];
};
