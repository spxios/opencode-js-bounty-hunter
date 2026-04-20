import { type Plugin } from "@opencode-ai/plugin";
import { exec } from "child_process";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const plugin: Plugin = {
  name: "opencode-js-bounty-hunter",
  description: "Automated JS bundle analysis and Bug Bounty Tracker UI",

  // Inject system prompt instructions so the agent knows how to use this plugin
  systemPrompt: `
## Bug Bounty Tracker Plugin
You have access to the Bug Bounty Tracker. When the user asks you to analyze a JS file for endpoints or use the "/js-bounty" command:
1. Extract API endpoints, paths, and secrets (like llab- keys) from the file or URL.
2. Formulate them into a JSON state object.
3. Use the bash tool to run: \`node node_modules/opencode-js-bounty-hunter/dist/start-server.js <target_url_or_file>\`
4. Reply concisely with the http://localhost:49152 link. Do NOT print endpoints to the terminal.
`
};

export default plugin;
