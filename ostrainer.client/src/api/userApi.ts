import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: () => 'getUserData',
    }),
  }),
});

export const { useGetUserDataQuery } = userApi;
