import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { listProductsCrumb } from '@app/features/products/components/list-products/list-products.crumb';

export const createProductCrumb = (): Breadcrumb[] => {
  return [
    ...listProductsCrumb(),
    {
      link: '/products/new',
      title: 'Create new product',
    },
  ];
};
