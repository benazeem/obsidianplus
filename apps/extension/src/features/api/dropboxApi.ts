// features/api/dropboxApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getValidDropboxToken } from "@/services/auth/dropboxAuth";
import axios from "axios";

export const dropboxApi = createApi({
  reducerPath: "dropboxApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.dropboxapi.com",
    prepareHeaders: async (headers) => {
      const token = await getValidDropboxToken();
      if (!token) throw new Error("Dropbox not authenticated");

      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDropboxUserInfo: builder.mutation<any, void>({
      async queryFn(_arg, _queryApi, _extraOptions, _fetchWithBQ) {
        const token = await getValidDropboxToken();

        try {
          const response = await axios.post(
            "https://api.dropboxapi.com/2/users/get_current_account",
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (
            !response.status ||
            response.status < 200 ||
            response.status >= 300
          ) {
            const text = await response.data;
            console.error("Dropbox user info error:", text);
            return {
              error: {
                status: response.status,
                statusText: response.statusText,
                data: text,
              },
            };
          }

          const data = await response.data;
          return { data };
        } catch (err) {
          return {
            error: {
              status: 0,
              statusText: "FETCH_ERROR",
              data: (err as Error).message,
            },
          };
        }
      },
    }),

    listDropboxFolders: builder.mutation<any, { path?: string }>({
      query: ({ path = "" }) => ({
        url: "/2/files/list_folder",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          path,
          include_mounted_folders: true,
          include_deleted: false,
          include_media_info: false,
          include_has_explicit_shared_members: false,
        },
      }),
      transformResponse: (response: { entries: any[] }) => {
        return response.entries.filter(
          (entry: any) => entry[".tag"] === "folder"
        );
      },
    }),

    uploadDropboxFile: builder.mutation<
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
          url: "https://content.dropboxapi.com/2/files/upload",
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "Dropbox-API-Arg": JSON.stringify({
              path: `${folderId}/${sanitizedFileName}`,
              mode: "overwrite",
              mute: true,
            }),
          },
          body: new Blob([fileContent], { type: mimeType }),
        };
      },
    }),
  }),
});

export const {
  useGetDropboxUserInfoMutation,
  useListDropboxFoldersMutation,
  useUploadDropboxFileMutation,
} = dropboxApi;
