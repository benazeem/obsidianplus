import { useEffect, useState } from "react";
import { FolderSync, MonitorUp, MonitorX, Settings } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
  connectGoogleDrive,
  connectOneDrive,
  connectDropbox,
} from "@/services/handlers/connectHandlers";
import Icons from "../../public/icons.json";
import { startServices } from "@/services/background";
import { handleVaultSync } from "@/services/handlers/handleVaultSync";

function PopupHead() {
  const [hostConnected, setHostConnected] = useState<boolean>(false);
  const [hostStatus, setHostStatus] = useState<string | null>("Loading ...");
  const dispatch = useDispatch<AppDispatch>();

  const vaultRoots = useSelector(
    (state: RootState) => state.obsidianVault.vaultRoots || []
  );
  const dropboxStatus = useSelector(
    (state: RootState) => state.dropbox.connected
  );
  const googleDriveStatus = useSelector(
    (state: RootState) => state.googleDrive.connected
  );
  const oneDriveStatus = useSelector(
    (state: RootState) => state.onedrive.connected
  );

  const handleOpenSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  const handleHostConnection = () => {
    try {
      chrome.runtime.sendMessage({ type: "GET_HOST_INFO" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Runtime error:", chrome.runtime.lastError.message);
          setHostConnected(false);
          setHostStatus(
            "Host is not connected: Click on Monitor icon to retry"
          );
          return;
        }

        if (response?.success) {
          const { platform, hostname } = response.data;
          setHostConnected(true);
          setHostStatus(`✅ Host connected to ${hostname} (${platform})`);
        } else {
          console.warn("❌ Could not get host status:", response?.error);
          setHostConnected(false);
          setHostStatus(
            "Host is not connected: Click on Monitor icon to retry"
          );
        }
      });
    } catch (err) {
      console.error("Unexpected error in handleHostConnection:", err);
      setHostConnected(false);
      setHostStatus("Host is not connected: Click on Monitor icon to retry");
    }
  };

  const handleReconnectHost = () => {
    startServices();
    setTimeout(() => {
      // console.log("Waited for 5 seconds");
      handleHostConnection();
    }, 5000);
  };

  const handleVaultRefresh = () => {
    handleVaultSync({
      vaultRoots,
      dispatch,
    });
  };

  useEffect(() => {
    handleHostConnection();
  });

  return (
    <>
      <div className="bg-gray-200/30 dark:bg-gray-700/30 backdrop-blur-md  shadow-lg p-1">
        <div className="w-full p-2 flex justify-between items-center ">
          <div
            className={`w-4 h-4 rounded-full ${hostConnected ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <h1 className="text-lg font-semibold ">Obsidian+ Web Clipper</h1>
          <button
            title="Open Settings"
            type="button"
            onClick={handleOpenSettings}
            className=" outline-none"
          >
            <Settings size={16} />
          </button>
        </div>
        <div className="w-full border-b-[0.5px] p-2 flex justify-between items-center">
          <button
            title={`${hostConnected ? "Connected" : "Retry Connection"}`}
            onClick={handleReconnectHost}
            disabled={hostConnected}
            className="outline-none"
          >
            {hostConnected ? <MonitorUp size={16} /> : <MonitorX size={16} />}
          </button>
          <button title="Sync All Vaults" onClick={handleVaultRefresh}>
            <FolderSync size={16} />
          </button>
          <button
            title={googleDriveStatus ? "Connectecd" : "Disconnected"}
            className={`w-5 h-5 outline-none relative`}
            disabled={googleDriveStatus}
            onClick={() => connectGoogleDrive(dispatch)}
          >
            <div
              className={`${googleDriveStatus ? "bg-green-500" : "bg-red-500"} absolute bottom-0 right-0 p-1  rounded-full`}
            ></div>
            <img
              className="w-4 h-4"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
              src={Icons.googleDriveIcon}
              alt="google-drive-sync"
            />
          </button>
          <button
            title={oneDriveStatus ? "Connectecd" : "Disconnected"}
            className={` w-5 h-5 outline-none relative`}
            disabled={oneDriveStatus}
            onClick={() => connectOneDrive(dispatch)}
          >
            <div
              className={`${oneDriveStatus ? "bg-green-500" : "bg-red-500"} absolute bottom-0 right-0 p-1 rounded-full`}
            ></div>

            <img
              className="w-4 h-4"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
              src={Icons.oneDriveIcon}
              alt="microsoft-onedrive"
            />
          </button>
          <button
            title={
              dropboxStatus ? "Connectecd" : "Not Connected: Click to Connect"
            }
            className={`w-5 h-5 outline-none relative`}
            disabled={dropboxStatus}
            onClick={() => connectDropbox(dispatch)}
          >
            <div
              className={`${dropboxStatus ? "bg-green-500" : "bg-red-500"} absolute bottom-0 right-0 p-1 rounded-full`}
            ></div>
            <img
              className="w-4 h-4"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
              src={Icons.dropboxIcon}
              alt="dropbox"
            />
          </button>
        </div>
        <div className="w-full p-1 text-sm text-center">{hostStatus}</div>
      </div>
    </>
  );
}

export default PopupHead;
