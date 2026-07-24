import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Split the rarely-changing animation/vendor libs into their own chunk
        // so they stay cached across deploys (app code changes far more often
        // than these do). They're needed on first paint for the animations, so
        // they load with the shell — but they no longer re-download every deploy.
        manualChunks: {
          animation: ["gsap", "motion", "lenis"],
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
