import { Product } from '@app/features/products/models/product.model';
import { Matchers } from '@pact-foundation/pact';
import { ResolutionType } from '@app/features/products/models/rule.model';

const { like, eachLike, term } = Matchers;

export const getProductBody: Product = {
  id: 'id',
  status: 'ACTIVE',
  productCategoryId: 'productCategoryId',
  name: 'name',
  description: 'description',
  productGuideLink: 'http://www.somewebsite.com/',
  counterpartyRoles: [
    {
      name: 'roleType',
      description: 'some description',
      type: 'PRIMARY',
      required: true,
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
      outcomeType: 'RESOLVABLE',
      outcomeDescription: 'outcomeDesc',
      resolutionType: ResolutionType.EXTERNAL,
    },
  ],
};

export const getProductMatcher = {
  id: like('id'),
  status: term({
    matcher: 'PENDING_APPROVAL|ACTIVE|INACTIVE|APPROVED',
    generate: 'ACTIVE',
  }),
  productCategoryId: like('productCategoryId'),
  name: like('name'),
  description: like('description'),
  productGuideLink: like('http://www.somewebsite.com/'),
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
    matchExpression: like('expr2'),
    resolutionType: like(ResolutionType.EXTERNAL),
    outcomeType: term({ matcher: 'RESOLVABLE|TERMINAL', generate: 'RESOLVABLE' }),
    outcomeDescription: like('outcomeDesc'),
  }),
};
