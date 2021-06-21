import { ProductType } from './product-category.model';

export interface ProductCategoryStatus {
  code: string;
  description: string;
}

export const PRODUCT_CATEGORY_STATUSES: ProductCategoryStatus[] = [
  { code: 'DRAFT', description: 'Draft' },
  { code: 'ACTIVE', description: 'Active' },
  { code: 'DISABLED', description: 'Disabled' },
];

export const PRODUCT_TYPES: ProductType[] = ['AR', 'SCF'];
