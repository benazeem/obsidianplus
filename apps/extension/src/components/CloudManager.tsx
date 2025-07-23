import { useState } from "react";
import { Button } from "@obsidianplus/ui";
import CloudConnector from "./CloudConnector";
import Icons from "../../public/icons.json";

function CloudManager() {
  const [cloudService, setCloudService] = useState<
    "onedrive" | "dropbox" | "gdrive" | null
  >(null);

  return (
    <>
      {cloudService && (
        <CloudConnector cloud={cloudService} setCloud={setCloudService} />
      )}
      <div aria-label="Cloud Management">
        <h2 className="text-xl font-semibold mb-2">Cloud Management</h2>
        <p className=" mb-4">
          Manage your cloud storage settings for Obsidian vaults.
        </p>
        <div className="mb-4">
          <div className="flex items-center justify-between gap-2 p-2">
            <Button
              variant={"outline"}
              size={"lg"}
              onClick={() => setCloudService("gdrive")}
            >
              <img
                className="w-6 h-6 "
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                src={Icons.googleDriveIcon}
                alt="google-drive-sync"
              />
            </Button>

            <Button
              variant={"outline"}
              size={"lg"}
              onClick={() => setCloudService("onedrive")}
            >
              <img
                className="w-4 h-4"
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                src={Icons.oneDriveIcon}
                alt="microsoft-onedrive"
              />
            </Button>

            <Button
              variant={"outline"}
              size={"lg"}
              onClick={() => setCloudService("dropbox")}
            >
              <img
                className="w-4 h-4"
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                src={Icons.dropboxIcon}
                alt="dropbox"
              />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CloudManager;
