import { eachLike, like } from '@pact-foundation/pact/dsl/matchers';

export const withPageMatcher = (bodyMatcher) => {
  return {
    data: eachLike(bodyMatcher),
    meta: {
      paged: {
        size: like(1),
        page: like(1),
        totalPages: like(1),
        pageSize: like(10),
        totalSize: like(1),
      },
    },
  };
};
