import { useEffect } from "react";
import { useSelector } from "react-redux";
import FolderAccordion from "./Accordion";
import SelectVault from "./SelectVault";
import type { RootState } from "@/store";
import Icons from "../../public/icons.json";
import obsidianIcon from "../../public/obsidian-icon.png";

const VaultManager: React.FC = () => {
  const obsidianFolders = useSelector(
    (state: RootState) => state.obsidianVault.folders || []
  );
  const googleDriveFolders = useSelector(
    (state: RootState) => state.googleDrive.folders
  );
  const dropboxFolders = useSelector(
    (state: RootState) => state.dropbox.folders
  );
  const oneDriveFolders = useSelector(
    (state: RootState) => state.onedrive.folders
  );
  const obsidianInputInterface = useSelector(
    (state: RootState) => state.ui.obsidianInputInterface
  );

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.id) {
        chrome.scripting?.executeScript?.({
          target: { tabId: tab.id },
          files: ["content.js"],
        });
      }
    });
  });

  return (
    <div className="bg-gray-100/40 dark:bg-gray-900/40  backdrop-blur-md shadow-lg">
      <div className="p-2">
        {obsidianFolders && obsidianFolders.length > 0 ? (
          <>
            <div className="flex justify-center items-center gap-1 w-full p-1 bg-gray-300/50 dark:bg-gray-800/50 text-center text-lg rounded-md dark:text-white">
              <img className="w-5 h-5" src={obsidianIcon} alt="obsidian-Icon" />
              <h3>Obsidian</h3>
            </div>
            <FolderAccordion location="obsidian" data={obsidianFolders} />
          </>
        ) : obsidianInputInterface ? (
          <SelectVault />
        ) : null}
      </div>
      {googleDriveFolders && (
        <div className="p-2">
          {googleDriveFolders && googleDriveFolders.length > 0 ? (
            <>
              <div className="flex justify-center items-center gap-1 w-full p-1 bg-gray-300/50 dark:bg-gray-800/50 text-center text-lg rounded-md dark:text-white">
                <img
                  className="w-5 h-5"
                  src={Icons.googleDriveIcon}
                  alt="googleDrive-Icon"
                />
                <h3>Google Drive</h3>
              </div>
              <FolderAccordion
                location="googledrive"
                data={googleDriveFolders}
              />
            </>
          ) : (
            <p className="text-gray-500">No Google Drive folders available.</p>
          )}
        </div>
      )}
      {oneDriveFolders && (
        <div className="p-2">
          {oneDriveFolders && oneDriveFolders.length > 0 ? (
            <>
              <div className="flex justify-center items-center gap-1 w-full p-1 bg-gray-300/50 dark:bg-gray-800/50 text-center text-lg rounded-md dark:text-white">
                <img
                  className="w-5 h-5"
                  src={Icons.oneDriveIcon}
                  alt="oneDrive-Icon"
                />
                <h3>OneDrive</h3>
              </div>
              <FolderAccordion location="onedrive" data={oneDriveFolders} />
            </>
          ) : (
            <p className="text-gray-500">No OneDrive folders available.</p>
          )}
        </div>
      )}
      {dropboxFolders && (
        <div className="p-2 ">
          {dropboxFolders && dropboxFolders.length > 0 ? (
            <>
              <div className="flex justify-center items-center gap-1 w-full p-1 bg-gray-300/50 dark:bg-gray-800/50 text-center text-lg rounded-md dark:text-white">
                <img
                  className="w-5 h-5"
                  src={Icons.dropboxIcon}
                  alt="dropbox-Icon"
                />
                <h3>Dropbox</h3>
              </div>
              <FolderAccordion location="dropbox" data={dropboxFolders} />
            </>
          ) : (
            <p className="text-gray-500">No Dropbox folders available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VaultManager;
