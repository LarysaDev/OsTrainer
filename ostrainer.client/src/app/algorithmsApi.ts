import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PageReplacementRequest, PageReplacementResults } from './types';

export const pageReplacementApi = createApi({
  reducerPath: 'pageReplacementApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    generateFifoMatrix: builder.mutation<PageReplacementResults, PageReplacementRequest>({
      query: (request) => ({
        url: 'PageReplacement/fifo',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const { useGenerateFifoMatrixMutation } = pageReplacementApi;
