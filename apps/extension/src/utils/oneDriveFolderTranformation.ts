import { oneDriveApi } from "@/features/api/oneDriveApi";
import type { AppDispatch } from "@/store";
import type { Folder } from "@/types";

function oneDriveDataTranformation(parent: Folder[] | Folder, folders: any[]) {
  folders.forEach((folder) => {
    if (Array.isArray(parent)) {
      parent.push({
        id: folder.id,
        name: folder.name,
        path: folder.parentReference?.path || "",
        folders: [],
      });
    } else {
      parent.folders.push({
        id: folder.id,
        name: folder.name,
        path: folder.parentReference?.path || "",
        folders: [],
      });
    }
  });
}

// Make sure to import or pass dispatch and googleDriveApi as needed
export const oneDriveFolderTransformation = async (
  folders: any[],
  dispatch: AppDispatch
) => {
  const oneDriveFolders: Folder[] = [];
  oneDriveDataTranformation(oneDriveFolders, folders); 
  for (const folder of folders) { 
    if (folder.folder && folder.folder.childCount > 0) {
      const children = await dispatch(
        oneDriveApi.endpoints.listOneDriveFolders.initiate({
          parentId: folder.id,
        })
      ).unwrap();

      oneDriveFolders.map((f) => {
        if (f.id === folder.id) { 
          oneDriveDataTranformation(f, children.folders);
        }
      });
    }
  }
  return oneDriveFolders;
};
