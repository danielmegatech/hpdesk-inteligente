import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { MindmapProvider } from "./context/MindmapContext";

createRoot(document.getElementById("root")!).render(
  <MindmapProvider>
    <App />
  </MindmapProvider>
);