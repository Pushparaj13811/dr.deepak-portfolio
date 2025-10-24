import { createRoot } from "react-dom/client";
import { App } from "./components/App";
// Import global styles; allow TypeScript to ignore missing type declarations for CSS
// @ts-ignore
import "./index.css";

function start() {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}