import { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CircleUserRound,
  FolderSync,
  Link,
  RefreshCcw,
  Unlink,
  X,
} from "lucide-react";
import { Button } from "@obsidianplus/ui";
import { default as handleCloudRefresh } from "@/services/handlers/refreshConnectionHandlers";
import { default as handleCloudFileRefresh } from "@/services/handlers/fileRefreshHandlers";
import { default as handleCloudConnect } from "@/services/handlers/connectHandlers";
import { default as handleCloudDisconnect } from "@/services/handlers/revokeHandlers";
import type { AppDispatch, RootState } from "@/store"; 

function CloudConnector({
  cloud,
  setCloud,
}: {
  cloud: "onedrive" | "dropbox" | "gdrive";
  setCloud: (cloud: "onedrive" | "dropbox" | "gdrive" | null) => void;
}) {
  const connectorRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>(); 

  const authenticated = useSelector((state: RootState) => {
    if (cloud === "gdrive") {
      return state.googleDrive.connected;
    }
    if (cloud === "onedrive") {
      return state.onedrive.connected;
    }
    if (cloud === "dropbox") {
      return state.dropbox.connected;
    }
  });

  const userInfo = useSelector((state: RootState) => {
    if (cloud === "gdrive") {
      return state.googleDrive.userInfo;
    }
    if (cloud === "onedrive") {
      return state.onedrive.userInfo;
    }
    if (cloud === "dropbox") {
      return state.dropbox.userInfo;
    }
  });

  const handleClose = useCallback(() => {
    if (setCloud) {
      setCloud(null);
    }
  }, [setCloud]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        connectorRef.current &&
        !connectorRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [connectorRef, handleClose]);

  return (
    <>
      <div className="w-full h-full fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div
          className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-4"
          ref={connectorRef}
        >
          <div className="flex flex-col items-center justify-evenly h-full">
            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
            <div
              className={`w-6 h-6 rounded-full ${authenticated ? "bg-green-500" : "bg-red-500"} absolute top-2 left-2 `}
            ></div>
            <h2 className="text-lg font-semibold mb-4">
              {cloud === "gdrive"
                ? "Google Drive"
                : cloud === "onedrive"
                  ? "OneDrive"
                  : "Dropbox"}
              Connector
            </h2>
            <div className="flex items-center justify-evenly gap-4">
              <Button
                disabled={authenticated}
                title={`Connect to ${cloud}`}
                onClick={() => {
                  handleCloudConnect(cloud, dispatch);
                }}
                className="bg-blue-500 text-white"
              >
                <Link size={16} /> Connect
              </Button>
              <Button
                title="Refresh Connection"
                onClick={() => {
                  handleCloudRefresh(cloud, dispatch);
                }}
                className="bg-green-500 text-white"
              >
                <RefreshCcw size={16} /> Refresh Connection
              </Button>
              <Button
                disabled={!authenticated}
                title={`Disconnect from ${cloud}`}
                onClick={() => {
                  handleCloudDisconnect(cloud, dispatch);
                }}
                className="bg-red-500 text-white"
              >
                <Unlink size={16} /> Disconnect
              </Button>
              <Button
                title="Refresh Folders"
                className="bg-gray-500 text-white"
                onClick={() => {
                  handleCloudFileRefresh(cloud, dispatch);
                }}
              >
                <FolderSync size={16} />
                Refresh Folders
              </Button>
            </div>
            {userInfo && (
              <div className="flex items-center justify-evenly gap-4 mt-6">
                {userInfo.picture ? (
                  <img
                    className="w-16 h-16 rounded-full mb-2"
                    draggable={false}
                    contextMenu="none"
                    src={userInfo.picture}
                    alt={`picture of ${userInfo.name}`}
                  />
                ) : (
                  <CircleUserRound size={16} />
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{userInfo.name}</h3>
                  <p className=" text-gray-600 dark:text-gray-400">
                    {userInfo.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CloudConnector;
