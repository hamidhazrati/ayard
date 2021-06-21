import { ProductStatus } from '@app/features/products/models/product.model';

interface ProductStatusDescription {
  code: ProductStatus;
  description: string;
}

export const PRODUCT_STATUSES: ProductStatusDescription[] = [
  { code: 'DRAFT', description: 'Draft' },
  { code: 'ACTIVE', description: 'Active' },
  { code: 'DISABLED', description: 'Disabled' },
];
