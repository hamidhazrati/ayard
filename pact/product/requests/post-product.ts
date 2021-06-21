import { CreateUpdateProduct } from '@app/features/products/models/product.model';
import { ResolutionType } from '@app/features/products/models/rule.model';

export const postProductBody: CreateUpdateProduct = {
  status: 'ACTIVE',
  productCategoryId: 'productCategoryId',
  name: 'name',
  description: 'description',
  productGuideLink: 'http://www.somewebsite.com/',
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
      resolutionType: ResolutionType.EXTERNAL,
      matchExpression: 'expr2',
      outcomeType: 'RESOLVABLE',
      outcomeDescription: 'outcomeDesc',
    },
  ],
};
