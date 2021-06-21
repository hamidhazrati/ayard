import { CreateUpdateProductCategory } from '@app/features/product-categories/models/product-category.model';

export const postProductCategoryBody: CreateUpdateProductCategory = {
  name: 'productCategory',
  status: 'ACTIVE',
  productType: 'AR',
  description: 'description of product category',
  productGuideLink: 'http://abc.xyz',
};
