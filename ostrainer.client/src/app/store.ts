import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './authApi';
import { fileGenerationApi } from './fileGenerationApi';
import { pageReplacementApi } from './algorithmsApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [fileGenerationApi.reducerPath]: fileGenerationApi.reducer,
    [pageReplacementApi.reducerPath]: pageReplacementApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(fileGenerationApi.middleware)
      .concat(pageReplacementApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
