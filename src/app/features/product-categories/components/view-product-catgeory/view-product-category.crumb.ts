import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { listProductsCrumb } from '@app/features/products/components/list-products/list-products.crumb';
import { ProductCategory } from '@app/features/product-categories/models/product-category.model';

export const viewProductCategoryCrumb = (productCategory: ProductCategory): Breadcrumb[] => {
  return [
    ...listProductsCrumb(),
    {
      title: 'Product Category',
    },
    {
      link: `/product-categories/${productCategory.id}`,
      title: `${productCategory.name}`,
    },
  ];
};
