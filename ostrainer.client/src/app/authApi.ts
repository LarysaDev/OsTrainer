import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from './types';
import { UserProfile, AssignedCourse } from '../Pages/Student/AssignedCourses/AssignedCourses';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    login: builder.mutation<User, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: 'Auth/login?useSessionCookies=true',
        method: 'POST',
        body: { email, password },
      }),
    }),
    register: builder.mutation<User, { email: string; password: string; role: string; userName: string }>({
      query: ({ email, password, role, userName }) => ({
        url: 'Auth/register?useSessionCookies=true',
        method: 'POST',
        body: { email, password, role, userName },
      }),
    }),
    getProfile: builder.mutation<UserProfile, { token: string }>({
      query: ({ token }) => ({
        url: 'Auth/profile',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
    }),
    getStudentsAssignments: builder.mutation<AssignedCourse[], { studentEmail: string }>({
      query: ({ studentEmail }) => ({
        url: '/assignment/getstudentassignments',
        params: { studentEmail: studentEmail },
        method: 'POST',
        body: { studentEmail },
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetProfileMutation, useGetStudentsAssignmentsMutation } = authApi;
