import { HTTPMethod } from '@pact-foundation/pact/common/request';
import { Query, RequestOptions } from '@pact-foundation/pact/dsl/interaction';
import { HttpParams } from '@angular/common/http';

const acceptJson = {
  Accept: 'application/json, text/plain, */*',
};

const contentTypeJson = {
  'Content-Type': 'application/json',
};

export const get = (path): RequestOptions => {
  return {
    method: HTTPMethod.GET,
    path,
    headers: {
      ...acceptJson,
    },
  };
};

export const getWithParams = (path, inputObject): RequestOptions => {
  let params: HttpParams = new HttpParams();
  Object.keys(inputObject).forEach((key: string) => {
    const value: string | number | boolean | Date = inputObject[key];
    if (typeof value !== 'undefined' && value !== null) {
      params = params.append(key, value.toString());
    }
  });
  const query: Query = params.toString();
  return {
    method: HTTPMethod.GET,
    path,
    query,
    headers: {
      ...acceptJson,
    },
  };
};

export const getWithHttpParams = (path, params: HttpParams): RequestOptions => {
  const query: Query = params.toString();
  return {
    method: HTTPMethod.GET,
    path,
    query,
    headers: {
      ...acceptJson,
    },
  };
};

export const put = (path, body): RequestOptions => {
  return {
    method: HTTPMethod.PUT,
    path,
    body,
    headers: {
      ...acceptJson,
      ...contentTypeJson,
    },
  };
};

export const putNoBody = (path): RequestOptions => {
  return {
    method: HTTPMethod.PUT,
    path,
    headers: {
      ...acceptJson,
    },
  };
};

export const patch = (path, body): RequestOptions => {
  return {
    method: HTTPMethod.PATCH,
    path,
    body,
    headers: {
      ...acceptJson,
      ...contentTypeJson,
    },
  };
};

export const post = (path, body): RequestOptions => {
  return {
    method: HTTPMethod.POST,
    path,
    body,
    headers: {
      ...acceptJson,
      ...contentTypeJson,
    },
  };
};

export const postNoBody = (path): RequestOptions => {
  return {
    method: HTTPMethod.POST,
    path,
    headers: {
      ...acceptJson,
    },
  };
};

export const pageRequest = (query = {}): HttpParams => {
  return new HttpParams({
    fromObject: {
      ...query,
      page: '0',
      pageSize: '5',
    },
  });
};
