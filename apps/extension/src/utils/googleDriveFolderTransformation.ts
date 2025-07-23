import { googleDriveApi } from "@/features/api/googleDriveApi";
import type { AppDispatch } from "@/store";
import type { Folder } from "@/types";

function googleDriveDataTranformation(parent: Folder[] | Folder, folders: any[]) {
  folders.forEach((folder) => {
    if (Array.isArray(parent)) {
      parent.push({
        id: folder.id,
        name: folder.name,
        path: folder.parents[0] || "",
        folders: [],
      });
    } else {
      parent.folders.push({
        id: folder.id,
        name: folder.name,
        path: folder.parents[0] || "",
        folders: [],
      });
    }
  });
}

// Make sure to import or pass dispatch and googleDriveApi as needed
export const googleDriveFolderTransformation = async (
  folders: any[],
  dispatch: AppDispatch
) => {
  const googleDriveFolders: Folder[] = [];
  googleDriveDataTranformation(googleDriveFolders, folders); 
  for (const folder of folders) {  
      const children = await dispatch(
        googleDriveApi.endpoints.listDriveFolders.initiate({
          parentId: folder.id,
        })
      ).unwrap();

    if (children && children.folders.length>0) {
      googleDriveFolders.map((f) => {
        if (f.id === folder.id) {
          googleDriveDataTranformation(f, children.folders);
        }
      });
    }
    } 
  return googleDriveFolders;
};
