import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { listProductsCrumb } from '@app/features/products/components/list-products/list-products.crumb';

export const createProductCategoryCrumb = (): Breadcrumb[] => {
  return [
    ...listProductsCrumb(),
    {
      link: '/product-categories/new',
      title: 'Create new product category',
    },
  ];
};
