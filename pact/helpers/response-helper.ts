import { ResponseOptions } from '@pact-foundation/pact/dsl/interaction';

const contentTypeJson = {
  'Content-Type': 'application/json',
};

export const ok = (body): ResponseOptions => {
  return { status: 200, ...withJson(body) };
};

export const noContent = (): ResponseOptions => {
  return { status: 204 };
};

export const created = (body): ResponseOptions => {
  return { status: 201, ...withJson(body) };
};

const withJson = (body) => {
  return {
    headers: { ...contentTypeJson },
    body: { ...body },
  };
};

export const withPage = (body) => {
  return {
    data: [body],
    meta: {
      paged: {
        size: 1,
        page: 1,
        totalPages: 1,
        pageSize: 10,
        totalSize: 1,
      },
    },
  };
};
