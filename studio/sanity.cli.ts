import { defineCliConfig } from "sanity/cli";

/**
 * CLI config, separate from sanity.config.ts, used by `sanity build` and
 * `sanity deploy`.
 *
 * `deployment.autoUpdates: false` pins the deployed Studio to the version we
 * built and tested, so the client's dashboard cannot change under them without
 * a deliberate redeploy.
 *
 * When the Studio moves under fikirfoods.et, build it with an explicit base
 * path and serve it from its own docroot:
 *   npx sanity build --base-path /studio
 * A subdomain (cms.fikirfoods.et) is preferred — the main site's .htaccess has
 * an SPA catch-all that would otherwise swallow the Studio's own routes.
 */
export default defineCliConfig({
  api: {
    projectId: "ntiaycof",
    dataset: "production",
  },
  /**
   * Fixes the hosted Studio address so `sanity deploy` is non-interactive and
   * always lands on the same URL the client has bookmarked. Change it only if
   * "fikirfoods" is already taken on sanity.studio.
   */
  studioHost: "fikirfoods",
  deployment: { autoUpdates: false },
});
