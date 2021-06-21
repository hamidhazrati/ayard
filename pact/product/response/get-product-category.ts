import { ProductCategory } from '../../../src/app/features/product-categories/models/product-category.model';
import { Matchers } from '@pact-foundation/pact';
import { ResolutionType } from '../../../src/app/features/products/models/rule.model';

const { like, eachLike, term } = Matchers;

export const getProductCategories: ProductCategory[] = [
  {
    id: 'b593aa97-0d5a-4ad9-b015-d3e9dee9e397',
    name: 'productCategory',
    productType: 'AR',
    status: 'ACTIVE',
    description: 'description of product category',
    productGuideLink: 'http://abc.xyz',
    products: [
      {
        id: 'id',
        status: 'ACTIVE',
        productCategoryId: 'productCategoryId',
        name: 'name',
        description: 'description',
        productGuideLink: 'productGuideLink',
        counterpartyRoles: [
          {
            name: 'roleType',
            description: 'some description',
            required: true,
            type: 'PRIMARY',
          },
        ],
        rules: [
          {
            name: 'rule1',
            resource: 'data',
            expression: 'expr1',
            message: 'failed criteria',
            code: '100',
            matchExpression: 'expr2',
            resolutionType: ResolutionType.EXTERNAL,
            outcomeType: 'RESOLVABLE',
            outcomeDescription: 'outcomeDesc',
          },
        ],
      },
    ],
  },
];

export const getProductCategoryMatcher = {
  id: like('b593aa97-0d5a-4ad9-b015-d3e9dee9e397'),
  name: like('productCategory'),
  status: like('ACTIVE'),
  productType: like('AR'),
  description: like('description of product category'),
  productGuideLink: like('http://abc.xyz'),
  products: eachLike({
    id: like('id'),
    status: term({
      matcher: 'PENDING_APPROVAL|ACTIVE|INACTIVE|APPROVED',
      generate: 'ACTIVE',
    }),
    productCategoryId: like('productCategoryId'),
    name: like('name'),
    description: like('description'),
    productGuideLink: like('productGuideLink'),
    counterpartyRoles: eachLike({
      name: like('roleType'),
      description: like('some description'),
      required: like(true),
      type: like('PRIMARY'),
    }),
    rules: eachLike({
      name: like('rule1'),
      resource: like('data'),
      expression: like('expr1'),
      message: like('failed criteria'),
      code: like('100'),
      resolutionType: like(ResolutionType.EXTERNAL),
      matchExpression: like('expr2'),
      outcomeType: term({ matcher: 'RESOLVABLE|TERMINAL', generate: 'RESOLVABLE' }),
      outcomeDescription: like('outcomeDesc'),
    }),
  }),
};

export const getProductCategoriesMatcher = eachLike(getProductCategoryMatcher);
