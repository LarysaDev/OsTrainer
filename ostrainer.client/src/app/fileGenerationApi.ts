import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { InputData, MatrixData } from '../common/FileDownloading/types';
import { DownloadType } from '../common/FileDownloading/types';

export const fileGenerationApi = createApi({
    reducerPath: 'fileGenerationApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    endpoints: (builder) => ({
      generateFile: builder.mutation<Blob, { fileType: string; request: InputData; matrixData: MatrixData, type: DownloadType }>({
        query: ({ fileType, request, matrixData, type }) => ({
          url: `FileGenerator/generate?fileType=${fileType}&type=${type.toString()}`,
          method: 'POST',
          body: { request, matrixData },
          responseHandler: async (response) => {
            console.log(matrixData)

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(errorText);
            }
            return response.blob();
          },
        }),
      }),
    }),
  });
  
  export const { useGenerateFileMutation } = fileGenerationApi;
  
