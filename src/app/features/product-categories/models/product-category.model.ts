import { OmitId, PickId } from '@app/shared/model/model-helpers';
import { Product } from '@app/features/products/models/product.model';

export interface ProductCategory {
  id: string;
  name: string;
  status: string;
  description: string;
  productGuideLink: string;
  productType: ProductType;
  products?: Product[];
}
export type CreatedProductCategory = PickId<ProductCategory>;
export type CreateUpdateProductCategory = Omit<OmitId<ProductCategory>, 'products'>;

export type ProductType = 'AR' | 'SCF';
