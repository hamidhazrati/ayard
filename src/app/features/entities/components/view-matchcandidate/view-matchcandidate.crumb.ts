import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { listEntitiesCrumb } from '@entities/components/list-entities/list-entities.crumb';
import { EntityMatchCandidate } from '../../models/entity-match-candidate.model';

export const viewMatchCandidateCrumb = (matchCandidate: EntityMatchCandidate): Breadcrumb[] => {
  return [
    ...listEntitiesCrumb(),
    {
      link: `/matchcandidates/${matchCandidate.id}`,
      title: matchCandidate.name,
    },
  ];
};
