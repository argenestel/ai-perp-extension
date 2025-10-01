import * as React from "react";
import { createRoot } from "react-dom/client";
import { ChatInterface } from "./components/ChatInterface";
import "./index.css";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <ChatInterface />
  </React.StrictMode>,
);
