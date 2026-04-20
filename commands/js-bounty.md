---
description: Analyze a target JS bundle, automatically extract API endpoints/secrets, and launch the Bug Bounty Tracker UI.
---

When the user invokes this command (e.g., `/js-bounty https://example.com/assets/js/app.js` or `/js-bounty /path/to/file.js`):

1. Extract the URL or file path provided by the user.
2. Execute the official plugin server using your Bash tool:
   \`killall bun 2>/dev/null; bun run node_modules/opencode-js-bounty-hunter/dist/start-server.js "<URL_OR_PATH>" > tracker.log 2>&1 &\`
3. Report the result back to the user concisely, providing the link: \`http://localhost:49152\`
4. Do not output massive lists of endpoints in the terminal; let the UI handle the display.