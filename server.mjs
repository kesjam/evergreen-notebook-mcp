#!/usr/bin/env node

const SERVER_NAME = "evergreen-notebook-mcp";
const SERVER_VERSION = "0.1.0";
const DEFAULT_PROTOCOL = "2025-11-25";

const resources = {
  "google-notebook://workflow": {
    name: "Google Notebook Evergreen Workflow",
    mimeType: "text/markdown",
    text: `# Google Notebook Evergreen Workflow

1. Prepare source packs before opening NotebookLM.
2. Use visible browser UI for personal NotebookLM.
3. Prefer Copied text when file upload or native pickers are fragile.
4. Customize Studio artifacts with audience, thesis, numbers, caveats, and purpose.
5. Ask a grounding chat question after every source batch.
6. Verify numeric claims and call out missing data before recommendations.
`
  },
  "google-notebook://studio-patterns": {
    name: "NotebookLM Studio Prompt Patterns",
    mimeType: "text/markdown",
    text: `# Studio Prompt Patterns

Data Table: metric, period, value, evidence, confidence, caveat, practical meaning.
Infographic: dashboard zones, exact anchors, visual hierarchy, caveat strip.
Slide Deck: human question, data boundary, trend, bottleneck, decision playbook.
Audio: human opening, analyst hosts, plain-English uncertainty.
Video: format, scene order, visual metaphors, misconception correction.
Report: thesis, evidence, limits, alternatives, action plan, evidence/caveat table.
Quiz/Flashcards: reasoning plus trap questions against overclaiming.
`
  },
  "google-notebook://safety": {
    name: "NotebookLM Safety and Boundary Notes",
    mimeType: "text/markdown",
    text: `# Safety and Boundary Notes

- Personal NotebookLM: visible browser UI by default.
- Enterprise NotebookLM: official API only with confirmed project/location/auth.
- Work sites: do not use hidden APIs when the user asks for human-visible behavior.
- Sensitive data: confirm before transmitting it to a new destination.
- Probability: distinguish historical frequency from prediction.
- Sources: mark missing data clearly instead of inventing.
`
  }
};

const toolDefinitions = [
  {
    name: "build_source_pack",
    title: "Build Notebook Source Pack",
    description: "Create a clean Markdown source pack for NotebookLM Copied text ingestion.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["title", "objective", "facts"],
      properties: {
        title: { type: "string", description: "Notebook source title." },
        objective: { type: "string", description: "What this source helps the notebook answer." },
        evidenceBoundary: { type: "string", description: "Date range, extraction method, or source limits." },
        facts: { type: "array", items: { type: "string" }, description: "High-confidence facts." },
        definitions: {
          type: "object",
          additionalProperties: { type: "string" },
          description: "Term-to-definition mapping."
        },
        assumptions: { type: "array", items: { type: "string" } },
        caveats: { type: "array", items: { type: "string" } },
        questions: { type: "array", items: { type: "string" } }
      }
    }
  },
  {
    name: "build_studio_prompt",
    title: "Build Studio Prompt",
    description: "Create a detailed NotebookLM Studio prompt for a specific artifact.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["artifactType", "title", "thesis"],
      properties: {
        artifactType: {
          type: "string",
          enum: ["data_table", "infographic", "slide_deck", "audio_overview", "video_overview", "report", "quiz", "flashcards", "mind_map"]
        },
        title: { type: "string" },
        thesis: { type: "string" },
        audience: { type: "string" },
        tone: { type: "string" },
        requiredNumbers: { type: "array", items: { type: "string" } },
        requiredCaveats: { type: "array", items: { type: "string" } },
        sections: { type: "array", items: { type: "string" } },
        visualDirections: { type: "array", items: { type: "string" } },
        decisionUse: { type: "string", description: "What the artifact should help decide." }
      }
    }
  },
  {
    name: "build_browser_runbook",
    title: "Build Notebook Browser Runbook",
    description: "Generate a safe visible-browser runbook for adding sources and generating Studio artifacts.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        notebookUrl: { type: "string" },
        sourceMode: { type: "string", enum: ["copied_text", "upload_files", "websites", "drive"], default: "copied_text" },
        sourceTitles: { type: "array", items: { type: "string" } },
        studioArtifacts: { type: "array", items: { type: "string" } },
        verificationQuestion: { type: "string" }
      }
    }
  },
  {
    name: "validate_source_pack",
    title: "Validate Notebook Source Pack",
    description: "Check a source pack for missing objective, evidence boundary, caveats, assumptions, definitions, and overclaiming risks.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["text"],
      properties: {
        text: { type: "string" },
        strictness: { type: "string", enum: ["light", "normal", "strict"], default: "normal" }
      }
    }
  },
  {
    name: "split_copied_text_sources",
    title: "Split Copied Text Sources",
    description: "Split long text into NotebookLM Copied text chunks with stable titles.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["titlePrefix", "text"],
      properties: {
        titlePrefix: { type: "string" },
        text: { type: "string" },
        maxChars: { type: "number", default: 18000 }
      }
    }
  }
];

const promptDefinitions = [
  {
    name: "notebook-grounding-check",
    description: "Ask NotebookLM to verify sources, summarize findings, and list caveats.",
    arguments: [
      { name: "focus", description: "Topic or decision to ground.", required: false }
    ]
  },
  {
    name: "source-pack-builder",
    description: "Prompt an agent to convert raw notes into NotebookLM-ready source packs.",
    arguments: [
      { name: "topic", description: "Notebook topic.", required: true }
    ]
  },
  {
    name: "studio-artifact-director",
    description: "Prompt an agent to create detailed Studio prompts for every artifact.",
    arguments: [
      { name: "artifact", description: "Artifact type.", required: true },
      { name: "decision", description: "Decision the artifact should support.", required: false }
    ]
  }
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function asList(items = []) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- Not specified.";
}

function asNumberList(items = []) {
  return items.length ? items.map((item, index) => `${index + 1}. ${item}`).join("\n") : "1. Summarize the strongest findings and caveats.\n2. What evidence is missing before recommendations?\n3. Where could the pattern be misunderstood?";
}

function buildSourcePack(args) {
  const definitions = args.definitions || {};
  const definitionLines = Object.keys(definitions).length
    ? Object.entries(definitions).map(([term, value]) => `- ${term}: ${value}`).join("\n")
    : "- Not specified.";
  return `# ${args.title}

Prepared: ${todayIso()}
Purpose: ${args.objective}
Evidence boundary: ${args.evidenceBoundary || "Not specified."}

## High-Confidence Facts
${asList(args.facts)}

## Definitions
${definitionLines}

## Assumptions
${asList(args.assumptions)}

## Caveats and Limits
${asList(args.caveats)}

## Suggested Notebook Questions
${asNumberList(args.questions)}
`;
}

function artifactLabel(type) {
  return type.split("_").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
}

function buildStudioPrompt(args) {
  const label = artifactLabel(args.artifactType);
  const sections = args.sections?.length
    ? `Build it with these sections or beats:\n${asNumberList(args.sections)}\n\n`
    : "";
  const visuals = args.visualDirections?.length
    ? `Visual or format directions:\n${asList(args.visualDirections)}\n\n`
    : "";
  const caveats = args.requiredCaveats?.length
    ? asList(args.requiredCaveats)
    : "- Historical analysis is not prediction.\n- Use 'not in source' instead of inventing missing facts.\n- Keep uncertainty visible near each claim.";
  const numbers = args.requiredNumbers?.length ? asList(args.requiredNumbers) : "- Use only numbers present in selected sources.";

  return `Create a ${label} titled "${args.title}".

Audience: ${args.audience || "A practical reader who needs decision-grade analysis."}
Tone: ${args.tone || "Clear, careful, and evidence-based."}
Thesis: ${args.thesis}
Decision this should support: ${args.decisionUse || "Help the reader decide what the evidence does and does not justify."}

Required numeric anchors:
${numbers}

Required caveats:
${caveats}

${sections}${visuals}Use only selected notebook sources. Do not overclaim. Make the artifact useful without requiring the reader to know the backstory.`;
}

function buildRunbook(args) {
  const urlLine = args.notebookUrl ? `1. Open ${args.notebookUrl}.` : "1. Open the target NotebookLM notebook.";
  const mode = args.sourceMode || "copied_text";
  const sourceLines = args.sourceTitles?.length
    ? args.sourceTitles.map((title, i) => `   - Source ${i + 1}: ${title}`).join("\n")
    : "   - Source titles not specified.";
  const artifacts = args.studioArtifacts?.length
    ? args.studioArtifacts.map((name, i) => `${i + 1}. ${name}`).join("\n")
    : "1. Data Table\n2. Infographic\n3. Report or Slide Deck\n4. Audio Overview\n5. Video Overview";
  return `# Visible Browser Runbook

${urlLine}
2. Go to Sources.
3. Click Add sources.
4. Use source mode: ${mode}.
5. Add these sources one at a time:
${sourceLines}
6. Wait until the source count updates.
7. Ask this grounding question:
${args.verificationQuestion || "List the current source titles, summarize the strongest findings, and list caveats before recommendations."}
8. Go to Studio and generate artifacts in this order:
${artifacts}
9. For each customizable artifact, paste a detailed prompt with audience, thesis, numbers, caveats, and decision use.
10. Verify numeric drift against sources before treating an output as final.
`;
}

function validateSourcePack(args) {
  const text = args.text || "";
  const checks = [
    ["title heading", /^#\s+/m],
    ["purpose/objective", /purpose|objective|core question/i],
    ["evidence boundary/date range", /evidence boundary|date range|prepared|extraction|range/i],
    ["facts section", /facts|findings|high-confidence/i],
    ["definitions", /definitions|terms/i],
    ["assumptions", /assumptions/i],
    ["caveats/limits", /caveats|limits|do not overclaim|not predict|uncertain/i],
    ["suggested questions", /questions|ask the notebook|grounding/i]
  ];
  const missing = checks.filter(([, pattern]) => !pattern.test(text)).map(([label]) => label);
  const riskWords = [];
  if (/\bwill\b|\bguarantee\b|\balways\b|\bnever\b/i.test(text)) {
    riskWords.push("Contains deterministic words such as will/guarantee/always/never. Make sure they are justified.");
  }
  if (!/not in source|missing|unknown|caveat|uncertain|historical/i.test(text)) {
    riskWords.push("May not make uncertainty visible enough.");
  }
  const status = missing.length || riskWords.length ? "needs_attention" : "ready";
  return JSON.stringify({ status, missing, warnings: riskWords }, null, 2);
}

function splitCopiedTextSources(args) {
  const maxChars = Math.max(2000, Math.min(Number(args.maxChars || 18000), 50000));
  const paragraphs = String(args.text || "").split(/\n(?=#\s+|##\s+)|\n{2,}/);
  const chunks = [];
  let current = "";
  for (const para of paragraphs) {
    const next = current ? `${current}\n\n${para}` : para;
    if (next.length > maxChars && current) {
      chunks.push(current);
      current = para;
    } else {
      current = next;
    }
  }
  if (current.trim()) chunks.push(current);
  return JSON.stringify({
    count: chunks.length,
    chunks: chunks.map((text, index) => ({
      title: `${args.titlePrefix} - Part ${index + 1}`,
      chars: text.length,
      text
    }))
  }, null, 2);
}

function toolResult(text, structuredContent) {
  return {
    content: [{ type: "text", text }],
    ...(structuredContent ? { structuredContent } : {})
  };
}

async function callTool(name, args = {}) {
  switch (name) {
    case "build_source_pack": {
      const text = buildSourcePack(args);
      return toolResult(text, { markdown: text });
    }
    case "build_studio_prompt": {
      const text = buildStudioPrompt(args);
      return toolResult(text, { prompt: text });
    }
    case "build_browser_runbook": {
      const text = buildRunbook(args);
      return toolResult(text, { markdown: text });
    }
    case "validate_source_pack": {
      return toolResult(validateSourcePack(args));
    }
    case "split_copied_text_sources": {
      return toolResult(splitCopiedTextSources(args));
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function promptMessages(name, args = {}) {
  if (name === "notebook-grounding-check") {
    const focus = args.focus ? ` for ${args.focus}` : "";
    return `Using only the selected notebook sources, list all current source titles, summarize the highest-confidence findings${focus}, identify caveats and missing data, and separate historical probability from prediction.`;
  }
  if (name === "source-pack-builder") {
    return `Turn the raw notes for ${args.topic || "this notebook"} into one or more NotebookLM-ready source packs. Each source pack must include title, purpose, evidence boundary, facts, definitions, assumptions, caveats, and suggested grounding questions.`;
  }
  if (name === "studio-artifact-director") {
    return `Create a detailed NotebookLM Studio prompt for ${args.artifact || "the requested artifact"}. The prompt must include audience, thesis, exact numeric anchors, caveats, structure, visual directions, and the decision it should support${args.decision ? `: ${args.decision}` : "."}`;
  }
  throw new Error(`Unknown prompt: ${name}`);
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function success(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function failure(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

async function handle(request) {
  if (!request || request.jsonrpc !== "2.0") return;
  const { id, method, params = {} } = request;
  const isNotification = id === undefined || id === null;

  try {
    if (method === "initialize") {
      return success(id, {
        protocolVersion: params.protocolVersion || DEFAULT_PROTOCOL,
        capabilities: {
          tools: { listChanged: false },
          resources: { subscribe: false, listChanged: false },
          prompts: { listChanged: false }
        },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
        instructions: "Prepare Google NotebookLM source packs, Studio prompts, browser runbooks, and verification prompts. This server is frontier-model friendly, stdio-only, local-first, dependency-free, and does not log in to Google or call NotebookLM APIs."
      });
    }
    if (method === "notifications/initialized") return;
    if (method === "notifications/cancelled") return;
    if (method === "ping") return success(id, {});
    if (method === "tools/list") return success(id, { tools: toolDefinitions });
    if (method === "tools/call") {
      const result = await callTool(params.name, params.arguments || params.input || {});
      return success(id, result);
    }
    if (method === "resources/list") {
      return success(id, {
        resources: Object.entries(resources).map(([uri, resource]) => ({
          uri,
          name: resource.name,
          mimeType: resource.mimeType,
          description: resource.text.split("\n").slice(0, 3).join(" ")
        }))
      });
    }
    if (method === "resources/read") {
      const resource = resources[params.uri];
      if (!resource) throw new Error(`Unknown resource: ${params.uri}`);
      return success(id, { contents: [{ uri: params.uri, mimeType: resource.mimeType, text: resource.text }] });
    }
    if (method === "resources/templates/list") return success(id, { resourceTemplates: [] });
    if (method === "prompts/list") return success(id, { prompts: promptDefinitions });
    if (method === "prompts/get") {
      const text = promptMessages(params.name, params.arguments || params.args || {});
      return success(id, {
        description: promptDefinitions.find((prompt) => prompt.name === params.name)?.description || params.name,
        messages: [{ role: "user", content: { type: "text", text } }]
      });
    }
    if (method === "logging/setLevel") return success(id, {});
    if (!isNotification) return failure(id, -32601, `Method not found: ${method}`);
  } catch (error) {
    if (!isNotification) failure(id, -32000, error instanceof Error ? error.message : String(error));
  }
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() || "";
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      void handle(JSON.parse(line));
    } catch (error) {
      failure(null, -32700, error instanceof Error ? error.message : String(error));
    }
  }
});

process.stdin.on("end", () => {
  if (buffer.trim()) {
    try {
      void handle(JSON.parse(buffer));
    } catch (error) {
      failure(null, -32700, error instanceof Error ? error.message : String(error));
    }
  }
});
