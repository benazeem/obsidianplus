import { setObsidianFolders } from "@/features";
import type { AppDispatch } from "@/store";
import { obsidianFolderTransformation } from "@/utils/obsidianFolderTransformation";

export const handleVaultSync = async ({
  vaultRoots,
  dispatch,
}: {
  vaultRoots: string[];
  dispatch: AppDispatch;
}) => {
  if (!vaultRoots || vaultRoots.length === 0) {
    console.warn("No vault root provided");
    return;
  }
  try {
    chrome.runtime.sendMessage(
      { type: "SCAN_VAULTS", payload: { vaultRoot: vaultRoots } },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Runtime error:", chrome.runtime.lastError.message);
          return;
        }
        if (response?.success) {
          const vaults = response.data ;  
          const obsidianFolders = obsidianFolderTransformation(vaults);
          dispatch(setObsidianFolders(obsidianFolders));
        } else { 
          console.warn("❌ Vault scan failed:", response?.error);
        }
      }
    );
  } catch (err) {
    console.error("Unexpected error in handleVaultSelection:", err);
  }
};
