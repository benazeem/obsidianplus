import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import "./index.css";
import Settings from "./pages/Settings.tsx";

createRoot(document.getElementById("settings-root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Settings />
    </Provider>
  </StrictMode>
);
