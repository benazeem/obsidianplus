import React, { useState } from "react";
import { ChevronDown, ChevronUp, Folder, Plus } from "lucide-react";
import type { FolderEntry } from "../types";
import { htmlPageToMarkdown } from "@/utils/markdownConverter";
import saveCloudFile from "@/services/handlers/saveFileHanlders";

interface FolderAccordionProps {
  data: FolderEntry[];
  location?: "obsidian" | "googledrive" | "onedrive" | "dropbox";
  level?: number;
}

const FolderAccordion: React.FC<FolderAccordionProps> = ({
  location,
  data,
  level = 0,
}) => {
  return (
    <div className="space-y-1">
      {data.map((folder, index) => (
        <FolderAccordionItem
          location={location}
          key={index}
          folder={folder}
          level={level}
        />
      ))}
    </div>
  );
};

const FolderAccordionItem: React.FC<{
  folder: FolderEntry;
  level: number;
  location?: "obsidian" | "googledrive" | "onedrive" | "dropbox";
}> = ({ location, folder, level }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = folder.folders?.length > 0;


  function sanitizeFileName(name: string): string {
  return name
    .replace(/[:*?"<>|\\/]/g, "") // remove illegal characters
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}

  const handlePageAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const pageMarkdown = await htmlPageToMarkdown();
    const fileContent = pageMarkdown.markdown;
    const fileName =
      pageMarkdown.title?.trim() !== ""
        ? `${pageMarkdown.title}_${new Date().toISOString().split("T")[0]}.md`
        : `Untitled_${new Date().toISOString().split("T")[0]}.md`;

  

    if (location === "obsidian") {
      const sanitizedFileName = sanitizeFileName(fileName);
      const filePath = `${folder.path}/${sanitizedFileName}`;
      // console.log("Saving file to Obsidian:", filePath);
      try {
        chrome.runtime.sendMessage(
          {
            type: "SAVE_OBSIDIAN_FILE",
            payload: { content: fileContent, path: filePath },
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Runtime error:", chrome.runtime.lastError.message);
              return;
            }
            if (response?.success) {
              // console.log("File saved successfully:", response.data);
            }
          }
        );
      } catch (error) {
        console.error("Error saving file:", error);
      }
    }
    if (location === "googledrive") {
      // console.log(`Saving file to ${location} folder:`, folder.name);
      saveCloudFile(location, {
        fileContent,
        fileName,
        mimeType: "text/plain",
        folderId: folder.id,
      });
    }
    if (location === "onedrive") {
      saveCloudFile(location, {
        fileContent,
        fileName,
        mimeType: "text/markdown",
        folderId: folder.id,
      });
    }
    if (location === "dropbox") {
      saveCloudFile(location, {
        fileContent,
        fileName,
        mimeType: "text/markdown",
        folderId: folder.path,
      });
    }
  };

  return (
    <div className="border-l border-gray-300 dark:border-gray-950 pl-2 ">
      <button
        type="button"
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-2 pr-4 pl-2 rounded  text-left"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <div className="flex items-center gap-2">
          <Folder size={16} className="text-yellow-600" />
          <span className="text-gray-800 dark:text-gray-200">
            {folder.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasChildren &&
            (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}

          <span
            onClick={handlePageAdd}
            title="Add Page to Obsidian Folder"
            role="button"
            className="w-5 h-5 ml-2 cursor-pointer"
          >
            <Plus size={16} />
          </span>
        </div>
      </button>

      {isOpen && hasChildren && (
        <div className="ml-2">
          <FolderAccordion
            location={location}
            data={folder.folders}
            level={level + 1}
          />
        </div>
      )}
    </div>
  );
};

export default FolderAccordion;
