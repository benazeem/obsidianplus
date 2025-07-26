// features/api/googleDriveApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getValidToken } from "../../services/auth/googleAuth";
import type { Folder } from "@/types";

export const googleDriveApi = createApi({
  reducerPath: "googleDriveApi",
  baseQuery: async (args, api, extraOptions) => {
    const token = await getValidToken();
    if (!token) throw new Error("Not authenticated");
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: "https://www.googleapis.com",
      prepareHeaders: (headers) => {
        headers.set("Authorization", `Bearer ${token}`);
        return headers;
      },
    });
    return rawBaseQuery(args, api, extraOptions);
  },
  endpoints: (builder) => ({
    getUserInfo: builder.query<any, void>({
      query: () => `/oauth2/v1/userinfo?alt=json`,
    }),

    listDriveFolders: builder.query<
      { folders: Folder[] },
      { parentId?: string }
    >({
      query: ({ parentId = "root" }) => ({
        url: "/drive/v3/files",
        params: {
          q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
          fields: "files(id,name,parents)",
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
          orderBy: "name",
          pageSize: "1000",
        },
      }),
      // transform the response to return the files array directly
      transformResponse: (response: { files: Folder[] }) => {
        return {
          folders: response.files,
        };
      },
    }),

    uploadFileToDrive: builder.mutation<
      any,
      {
        fileName: string;
        fileContent: string;
        mimeType?: string;
        folderId?: string;
      }
    >({
      async queryFn({
        fileName,
        fileContent,
        mimeType = "text/plain", // 👈 Plain text for Drive preview
        folderId,
      }) {
        try {
          const token = await getValidToken();

          const metadata = {
            name: fileName,
            mimeType,
            ...(folderId && { parents: [folderId] }),
          };

          const formData = new FormData();
          formData.append(
            "metadata",
            new Blob([JSON.stringify(metadata)], { type: "application/json" })
          );

          // ✅ Ensure proper UTF-8 encoding
          const encodedContent = new TextEncoder().encode(fileContent);
          formData.append(
            "file",
            new Blob([encodedContent], { type: mimeType })
          );

          const response = await fetch(
            "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            return { error: { status: response.status, data: errorData } };
          }

          const data = await response.json();
          return { data };
        } catch (error: any) {
          return {
            error: { status: 0, data: error?.message || "Unknown error" },
          };
        }
      },
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useListDriveFoldersQuery,
  useUploadFileToDriveMutation,
} = googleDriveApi;
