import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
// Ethiopic (Ge'ez) fonts for Amharic — the Latin display/body fonts don't
// cover the script, so these render Amharic properly.
import "@fontsource/noto-serif-ethiopic/500.css";
import "@fontsource/noto-serif-ethiopic/600.css";
import "@fontsource/noto-sans-ethiopic/400.css";
import "@fontsource/noto-sans-ethiopic/500.css";
import "./index.css";

import App from "./App";
import { I18nProvider } from "./i18n/I18nProvider";

// After a redeploy, hashed lazy chunks referenced by an already-open tab no
// longer exist; Vite fires this event instead of leaving a blank page.
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nProvider>
  </StrictMode>,
);
