#!/usr/bin/env node

import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const serverPath = join(root, "server.mjs");
const child = spawn(process.execPath, [serverPath], {
  stdio: ["pipe", "pipe", "pipe"]
});

let buffer = "";
const responses = [];

child.stdout.setEncoding("utf8");
child.stdout.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() || "";
  for (const line of lines) {
    if (line.trim()) responses.push(JSON.parse(line));
  }
});

function send(id, method, params = {}) {
  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
}

send(1, "initialize", { protocolVersion: "2025-11-25" });
send(2, "tools/list");
send(3, "tools/call", {
  name: "build_source_pack",
  arguments: {
    title: "Smoke Test",
    objective: "Verify server output.",
    facts: ["The server returned a source pack."]
  }
});
send(4, "tools/call", {
  name: "build_artifact_prompt_pack",
  arguments: {
    title: "Smoke Artifact Pack",
    objective: "Verify full prompt pack output.",
    artifactTypes: ["data_table", "video_overview"],
    includeUseCases: false
  }
});

await new Promise((resolve) => setTimeout(resolve, 250));
child.kill();
await once(child, "close");

const initialize = responses.find((item) => item.id === 1);
const tools = responses.find((item) => item.id === 2);
const call = responses.find((item) => item.id === 3);
const artifactPack = responses.find((item) => item.id === 4);

if (!initialize?.result?.serverInfo?.name) throw new Error("Missing initialize response");
if (!tools?.result?.tools?.some((tool) => tool.name === "build_source_pack")) {
  throw new Error("Missing build_source_pack tool");
}
if (!tools?.result?.tools?.some((tool) => tool.name === "build_artifact_prompt_pack")) {
  throw new Error("Missing build_artifact_prompt_pack tool");
}
if (!call?.result?.content?.[0]?.text?.includes("# Smoke Test")) {
  throw new Error("Tool call did not return expected source pack");
}
if (!artifactPack?.result?.content?.[0]?.text?.includes("Smoke Artifact Pack - Video Overview")) {
  throw new Error("Artifact prompt pack did not include expected video prompt");
}

console.log("Smoke test passed");
