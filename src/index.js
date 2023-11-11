import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// import App from "./optimistic";
// import App from "./prefetch";
import App from "./prefetch-pagination";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
