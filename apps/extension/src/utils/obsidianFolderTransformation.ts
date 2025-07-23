import type { Folder } from "@/types";

export const obsidianFolderTransformation = (vaults: any[]) => {
  const obsidianFolders: Folder[] = [];
  for (const vault of vaults) {
    const transformedFolder: Folder = {
      id: "0" + crypto.randomUUID(),
      name: vault.name,
      path: vault.path || "",
      folders: internalTransformation(vault.folders || []),
    };
    obsidianFolders.push(transformedFolder);
  }
  return obsidianFolders;
};

const internalTransformation = (folders: any[]): Folder[] => {
  let i = 0;
  return folders.map((folder) => ({
    id: ++i + crypto.randomUUID(),
    name: folder.name,
    path: folder.path || "",
    folders: internalTransformation(folder.children || []),
  }));
};
