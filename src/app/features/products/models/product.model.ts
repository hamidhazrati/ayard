import { ProductCounterpartyRole } from '@app/features/products/models/product-counterparty-role.model';
import { OmitId, PickId } from '@app/shared/model/model-helpers';
import { Rule } from './rule.model';

export interface Product {
  id: string;
  status: ProductStatus;
  productCategoryId: string;
  name: string;
  description: string;
  productGuideLink: string;
  counterpartyRoles: ProductCounterpartyRole[];
  rules: Rule[];
  parameters?: {};
}

export type CreatedProduct = PickId<Product>;
export type CreateUpdateProduct = OmitId<Product>;
export type ProductSearch = Pick<Product, 'productCategoryId' | 'name'>;

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'DISABLED';
