import { useEffect } from "react";
import VaultManager from "../components/VaultManager";
import { Button } from "@obsidianplus/ui";
import PopupHead from "../components/PopupHead";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { initializeStates } from "@/services/background";
import { Bug, Github, MessageSquarePlus } from "lucide-react";
import setNotification from "@/utils/Notification";

const Popup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.ui.theme);
  const background = useSelector(
    (state: RootState) => state.ui.backgroundImageUrl
  );
  const fontSize = useSelector((state: RootState) => state.ui.fontSize);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeStates(dispatch);
      } catch (error) { 
        setNotification(
          "Failed to initialize states: " + error,
          "error"
        );
      }
    };

    init();
  }, [dispatch]);

  return (
    <div
      className={`w-[300px] max-h-[500px] min-h-[300px] ${fontSize} bg-cover bg-center overflow-y-scroll overflow-x-hidden `}
      style={{ backgroundImage: `url(${background})` }}
    >
      <PopupHead />
      <VaultManager />
      <div className="p-4 flex flex-col items-center justify-center bg-gray-100/40 dark:bg-gray-900/40 gap-2">
        <h3 className="text-lg font-semibold mb-2">
          Suggestions &amp; Bug Reports
        </h3>
        <div className="flex items-center justify-evenly gap-4">
          <Button
            variant={"ghost"}
            onClick={() => {
              window.open(
                "https://github.com/benazeem/obsidianplus/issues/new?template=bug_report.md",
                "_blank"
              );
            }}
          >
            <Bug className="inline-block " />
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => {
              window.open(
                "https://github.com/benazeem/obsidianplus/issues/new?template=feature_request.md",
                "_blank"
              );
            }}
          >
            <MessageSquarePlus className="inline-block " />
          </Button>
          <Button
            type="button"
            variant={"ghost"}
            onClick={() => {
              window.open("https://github.com/benazeem/obsidianplus", "_blank");
            }}
          >
            <Github className="inline-block" />
          </Button>
        </div>
        <div>
          Made with ❤️ by{" "}
          <a
            href="https://github.com/benazeem"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            benazeem
          </a>
        </div>
      </div>
    </div>
  );
};

export default Popup;
