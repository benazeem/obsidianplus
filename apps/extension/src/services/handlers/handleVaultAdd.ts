import { addObsidianVaultRoot } from "@/features/obsidianSlice";
import type { AppDispatch } from "@/store";

export const handleVaultAdd = ({ path, dispatch, setPath }: { path: string; dispatch:AppDispatch; setPath: React.Dispatch<React.SetStateAction<string>> }) => {
    if (!path || path.trim() === "") {
      console.warn("Vault root path is empty");
      return;
    }
    const newRoots = path.split(",").map((root) => root.trim());
    if (newRoots.length === 0) {
      console.warn("No valid vault roots provided");
      return;
    }
    newRoots.forEach((root) => { 
      dispatch(addObsidianVaultRoot(root));
    });
    setPath("");
  };