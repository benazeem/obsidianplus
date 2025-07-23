import { dropboxApi } from "@/features/api/dropboxApi"; 
import type { AppDispatch } from "@/store";
import type { Folder } from "@/types";

function dropboxDataTranformation(parent: Folder[] | Folder, folders: any[]) {
  folders.forEach((folder) => {
    if (Array.isArray(parent)) {
      parent.push({
        id: folder.id,
        name: folder.name,
        path: folder.path_lower || "",
        folders: [],
      });
    } else {
      parent.folders.push({
        id: folder.id,
        name: folder.name,
        path: folder.path_lower || "",
        folders: [],
      });
    }
  });
}

// Make sure to import or pass dispatch and googleDriveApi as needed
export const dropboxFolderTransformation = async (
  folders: any[],
  dispatch: AppDispatch
) => {
  const dropboxFolders: Folder[] = [];
  dropboxDataTranformation(dropboxFolders, folders); 
  for (const folder of folders) { 
      const children = await dispatch(
        dropboxApi.endpoints.listDropboxFolders.initiate({
          path: folder.path_lower || "", 
        })
      ).unwrap();
      
      if( children) {
      dropboxFolders.map((f) => {
        if (f.id === folder.id) {
          dropboxDataTranformation(f, children);
        }
      });}
    } 
  return dropboxFolders;
};
