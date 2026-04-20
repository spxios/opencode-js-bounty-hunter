// @bun
// src/index.ts
import { fileURLToPath } from "url";
import { dirname } from "path";
var __filename2 = fileURLToPath(import.meta.url);
var __dirname2 = dirname(__filename2);
var plugin = {
  name: "opencode-js-bounty-hunter",
  description: "Automated JS bundle analysis and Bug Bounty Tracker UI",
  systemPrompt: `
## Bug Bounty Tracker Plugin
You have access to the Bug Bounty Tracker. When the user asks you to analyze a JS file for endpoints or use the "/js-bounty" command:
1. Extract API endpoints, paths, and secrets (like llab- keys) from the file or URL.
2. Formulate them into a JSON state object.
3. Use the bash tool to run: \`node node_modules/opencode-js-bounty-hunter/dist/start-server.js <target_url_or_file>\`
4. Reply concisely with the http://localhost:49152 link. Do NOT print endpoints to the terminal.
`
};
var src_default = plugin;
export {
  src_default as default
};
