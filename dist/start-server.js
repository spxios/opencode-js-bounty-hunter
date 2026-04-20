import { serve } from "bun";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { $ } from "bun";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 49152;
const DATA_FILE = join(process.cwd(), "tracker-state.json");
const HTML_FILE = join(__dirname, "..", "tracker-ui.html");

const targetFile = process.argv[2];

// Run Analysis if target provided
if (targetFile) {
    console.log(`🔍 Analyzing target: ${targetFile}...`);
    let content = "";
    try {
        if (targetFile.startsWith("http")) {
            // It's a bit sync-hacky but we're in bun so we can use await if we wrap it, 
            // but let's just do it cleanly inside an async IIFE
        } else {
            content = readFileSync(targetFile, "utf-8");
            runAnalysis(content);
        }
    } catch (e) {
        console.error("Analysis failed:", e.message);
    }
}

async function start() {
    if (targetFile && targetFile.startsWith("http")) {
        const response = await fetch(targetFile);
        const content = await response.text();
        runAnalysis(content);
    }
    
    let state = { phases: [] };
    if (existsSync(DATA_FILE)) {
        state = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
    }
    
    console.log(`✅ Bug Bounty Tracker UI running at http://localhost:${PORT}`);
    
    serve({
        port: PORT,
        async fetch(req) {
            const url = new URL(req.url);
            if (url.pathname === "/api/state" && req.method === "GET") {
                return new Response(JSON.stringify(state), { headers: { "Content-Type": "application/json" } });
            }
            if (url.pathname === "/api/state" && req.method === "POST") {
                state = await req.json();
                writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
                return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
            }
            if (url.pathname === "/") {
                return new Response(readFileSync(HTML_FILE, "utf-8"), { headers: { "Content-Type": "text/html" } });
            }
            return new Response("Not Found", { status: 404 });
        }
    });
}

function runAnalysis(content) {
    const rawPathRegex = /(?:\/api\/|\/v[1-3]\/|\/jwt\/)[a-zA-Z0-9_/?&=-]+/gi;
    const llabRegex = /['"`](llab-[a-zA-Z0-9-]+)['"`]/g;
    
    const endpoints = [];
    let match;
    while ((match = rawPathRegex.exec(content)) !== null) {
        let path = match[0];
        if (path.endsWith('"') || path.endsWith("'") || path.endsWith("\`")) path = path.slice(0, -1);
        if (!endpoints.find(e => e.path === path)) endpoints.push({ method: "ANY", path });
    }
    
    const llabKeys = new Set();
    while ((match = llabRegex.exec(content)) !== null) llabKeys.add(match[1]);
    
    const state = { phases: [] };
    if (endpoints.length > 0) {
        state.phases.push({
            name: "Phase 1: Extracted API Endpoints",
            endpoints: endpoints.map(e => ({
                id: Math.random().toString(36).substr(2, 9), method: e.method, path: e.path, params: "", notes: "", status: "pending"
            })),
            tests: []
        });
    }
    if (llabKeys.size > 0) {
        state.phases.push({
            name: "Phase 2: Local Storage Secrets",
            endpoints: Array.from(llabKeys).map(key => ({
                id: Math.random().toString(36).substr(2, 9), method: "LOCAL", path: key, params: "", notes: "", status: "investigating"
            })),
            tests: []
        });
    }
    writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
}

start();
