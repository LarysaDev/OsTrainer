import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './authApi';
import { fileGenerationApi } from './fileGenerationApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [fileGenerationApi.reducerPath]: fileGenerationApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(fileGenerationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
