import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getOneDriveValidToken } from "@/services/background";
import type { Folder } from "@/types";

export const oneDriveApi = createApi({
  reducerPath: "oneDriveApi",
  baseQuery: async (args, api, extraOptions) => {
    const token = await getOneDriveValidToken();
    if (!token) throw new Error("Not authenticated");

    const rawBaseQuery = fetchBaseQuery({
      baseUrl: "https://graph.microsoft.com/v1.0",
      prepareHeaders: (headers) => {
        headers.set("Authorization", `Bearer ${token}`);
        return headers;
      },
      fetchFn: async (input, init) => {
        const url = typeof input === "string" ? input : input.url;
        const res = await fetch(input, init);

        if (url.includes("/photo/$value")) {
          const blob = await res.blob();

          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          // Return JSON data instead of a blob response
          return new Response(JSON.stringify({ dataUrl: base64 }), {
            status: res.status,
            statusText: res.statusText,
            headers: { "Content-Type": "application/json" },
          });
        }

        return res;
      },
    });

    return rawBaseQuery(args, api, extraOptions);
  },

  endpoints: (builder) => ({
    getOneDriveUserInfo: builder.query<any, void>({
      query: () => "/me",
    }),

    getOneDriveUserPhoto: builder.query<{ dataUrl: string }, void>({
      query: () => ({
        url: "/me/photo/$value",
      }),
      transformResponse: (response: { dataUrl: string }) => {
        return response;
      },
    }),

    listOneDriveFolders: builder.query<
      { folders: Folder[] },
      { parentId?: string }
    >({
      query: ({ parentId = "" }) => {
        const path = parentId
          ? `/me/drive/items/${parentId}/children`
          : `/me/drive/root/children`;
        return {
          url: path,
          params: {
            $filter: "folder ne null",
            $orderby: "name",
            $top: 1000,
            $select: "id,name,folder,parentReference,path",
          },
        };
      },
      transformResponse: (response: any) => ({
        folders: response.value || [],
      }),
    }),

    uploadFileToOneDrive: builder.mutation<
      any,
      {
        folderId: string;
        fileName: string;
        fileContent: string | Blob;
        mimeType?: string;
      }
    >({
      query: ({
        folderId,
        fileName,
        fileContent,
        mimeType = "text/markdown",
      }) => { 
        const sanitizedFileName = fileName.replace(/[:*?"<>|/\\]/g, "-");
        return {
          url: `/me/drive/items/${folderId}:/${sanitizedFileName}:/content`,
          method: "PUT",
          body: new Blob([fileContent], { type: mimeType }),
          headers: {
            "Content-Type": mimeType,
          },
        };
      },
    }),
  }),
});

export const {
  useGetOneDriveUserInfoQuery,
  useGetOneDriveUserPhotoQuery,
  useListOneDriveFoldersQuery,
  useUploadFileToOneDriveMutation,
} = oneDriveApi;
