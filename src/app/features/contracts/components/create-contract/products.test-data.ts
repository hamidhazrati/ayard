import { Product } from '@app/features/products/models/product.model';
import { ProductCategory } from '@app/features/product-categories/models/product-category.model';

export const products: Product[] = [
  {
    id: '0',
    status: 'DRAFT',
    productCategoryId: 'AR_ID',
    name: 'AR 1 Name',
    description: 'AR 1 Description',
    productGuideLink: 'http://product.verdi.com/AR_1',
    counterpartyRoles: [
      {
        name: 'SELLER',
        description: 'Seller',
        required: true,
        type: 'PRIMARY',
      },
    ],
    rules: [],
  },
  {
    id: '1',
    status: 'ACTIVE',
    productCategoryId: 'AR_ID',
    name: 'AR sub',
    description: 'AR 2 Description',
    productGuideLink: 'http://product.verdi.com/AR_2',
    counterpartyRoles: [
      {
        name: 'SELLER',
        description: 'Seller',
        required: true,
        type: 'RELATED',
      },
      {
        name: 'OTHER',
        description: 'Other',
        required: false,
        type: 'OTHER',
      },
    ],
    rules: [],
  },
  {
    id: '2',
    status: 'DISABLED',
    productCategoryId: 'AR_ID',
    name: 'AR sub 2',
    description: 'AR 3 Description',
    productGuideLink: 'http://product.verdi.com/AR_3',
    counterpartyRoles: [
      {
        name: 'string',
        description: 'string',
        required: true,
        type: 'OTHER',
      },
    ],
    rules: [],
  },
  {
    id: '3',
    status: 'ACTIVE',
    productCategoryId: 'AR_ID',
    name: 'AR sub 3',
    description: 'SCF 4 Description',
    productGuideLink: 'http://product.verdi.com/AR_4',
    counterpartyRoles: [
      {
        name: 'string',
        description: 'string',
        required: true,
        type: 'PRIMARY',
      },
    ],
    rules: [],
  },
  {
    id: '4',
    status: 'ACTIVE',
    productCategoryId: 'AR_ID',
    name: 'AR 5 Name',
    description: 'AR 5 Description',
    productGuideLink: 'http://product.verdi.com/AR_5',
    counterpartyRoles: [
      {
        name: 'string',
        description: 'string',
        required: true,
        type: 'RELATED',
      },
    ],
    rules: [],
  },
  {
    id: '5',
    status: 'ACTIVE',
    productCategoryId: 'SCF_ID',
    name: 'Sub SCF',
    description: 'SCF 1 Description',
    productGuideLink: 'http://product.verdi.com/SCF_1',
    counterpartyRoles: [
      {
        name: 'string',
        description: 'string',
        required: true,
        type: 'OTHER',
      },
    ],
    rules: [],
  },
];

export const productCategories: ProductCategory[] = [
  {
    id: 'AR_ID',
    name: 'AR Category',
    description: 'AR Category Description',
    status: 'ACTIVE',
    productType: 'AR',
    productGuideLink: null,
    products: products.filter((p) => p.productCategoryId === 'AR_ID'),
  },
  {
    id: 'SCF_ID',
    name: 'SCF Category',
    description: 'SCF Category Description',
    status: 'ACTIVE',
    productType: 'SCF',
    productGuideLink: null,
    products: products.filter((p) => p.productCategoryId === 'SCF_ID'),
  },
];
