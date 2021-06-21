import { Matchers } from '@pact-foundation/pact';

const { like } = Matchers;

export const postProductMatcher = {
  id: like('b593aa97-0d5a-4ad9-b015-d3e9dee9e396'),
};

export const postProductCreated = {
  id: 'b593aa97-0d5a-4ad9-b015-d3e9dee9e396',
};
