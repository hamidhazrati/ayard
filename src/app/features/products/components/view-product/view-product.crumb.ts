import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { listProductsCrumb } from '@app/features/products/components/list-products/list-products.crumb';
import { Product } from '@app/features/products/models/product.model';
import { ProductCategory } from '@app/features/product-categories/models/product-category.model';

export const viewProductCrumb = (
  product: Product,
  productCategory: ProductCategory,
): Breadcrumb[] => {
  return [
    ...listProductsCrumb(),
    {
      link: `/products/${product.id}`,
      title: `${productCategory.name} ${product.name}`,
    },
  ];
};
