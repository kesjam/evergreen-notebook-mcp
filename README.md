# Evergreen Notebook MCP

**Privacy-safe NotebookLM workflow tools for frontier LLM agents.**

Evergreen Notebook MCP is a local Model Context Protocol server and reusable agent skill for building better Google NotebookLM notebooks. It helps frontier-model assistants prepare clean source packs, detailed Studio prompts, browser runbooks, and grounding checks without logging in to Google or touching private NotebookLM endpoints.

It is designed for any MCP-capable frontier LLM client: Codex-style agents, Claude-style agents, Cursor/Windsurf-style IDE agents, desktop assistants, and future MCP clients that can launch a local stdio server.

## Highlights

- **MCP-first:** standard JSON-RPC over stdio, no vendor SDK required.
- **Model-neutral:** works with any frontier LLM client that supports MCP tools.
- **Privacy-safe:** no Google auth, no cookies, no hidden NotebookLM API calls.
- **NotebookLM-native:** optimized for visible UI workflows like **Copied text**, Studio, and chat verification.
- **Professional outputs:** source packs, Studio prompts, runbooks, prompt templates, validation reports.
- **Agentic prompt packs:** full source-to-Studio plans for tables, reports, slides, audio, video, infographics, study aids, notes, and mind maps.
- **Creative use cases:** reusable ideas for decision rooms, pattern analysis, onboarding, research dossiers, customer voice labs, and creator studios.
- **Public-project friendly:** dependency-free Node server, MIT license, security notes, examples, and agent skill.

## Why This Exists

NotebookLM becomes dramatically better when sources are clean and prompts are deliberate. Evergreen Notebook MCP makes that repeatable:

- turn messy notes into NotebookLM-ready source packs,
- split long copied-text sources into stable chunks,
- generate detailed Studio prompts for reports, slides, audio, video, infographics, quizzes, flashcards, and data tables,
- create complete artifact prompt packs for all major NotebookLM outputs,
- brainstorm creative, source-grounded notebook use cases,
- create visible-browser runbooks for safe source ingestion,
- validate that source packs include evidence boundaries, assumptions, caveats, and missing-data notes.

## What It Does Not Do

- It does **not** log in to Google.
- It does **not** read browser cookies.
- It does **not** call private NotebookLM endpoints.
- It does **not** scrape work systems.
- It does **not** bypass web safety barriers.
- It does **not** pretend historical patterns are predictions.

## Install

Requirements:

- Node.js 18 or newer.
- An MCP-capable client that can launch a stdio server.

Clone the repo:

```bash
git clone https://github.com/kesjam/evergreen-notebook-mcp.git
cd evergreen-notebook-mcp
npm run check
npm run smoke
```

Point your MCP client at `server.mjs`.

## Client Configuration

### Codex

Add this to your Codex config:

```toml
[mcp_servers.evergreen-notebook]
command = "node"
args = ["/absolute/path/to/evergreen-notebook-mcp/server.mjs"]
startup_timeout_sec = 10.0
tool_timeout_sec = 30.0
```

### Claude Desktop-Style Config

```json
{
  "mcpServers": {
    "evergreen-notebook": {
      "command": "node",
      "args": ["/absolute/path/to/evergreen-notebook-mcp/server.mjs"]
    }
  }
}
```

### Generic MCP Client

Use a local stdio transport:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/evergreen-notebook-mcp/server.mjs"]
}
```

See [docs/frontier-compatibility.md](docs/frontier-compatibility.md) for compatibility notes and [examples](examples) for ready-to-adapt config snippets.

## Suggested Agent Prompt

After connecting the MCP server, try:

```text
Use evergreen-notebook to turn these notes into a NotebookLM source pack, then create a detailed Studio prompt for an infographic and a grounding question to verify the notebook.
```

Or:

```text
Use evergreen-notebook to create a visible-browser runbook for adding three sources to NotebookLM through Copied text, then generate a report and audio overview with explicit caveats.
```

For a full build:

```text
Use evergreen-notebook to create a complete artifact prompt pack for this NotebookLM project: source pack, source guide, grounding chat, Data Table, report, briefing doc, FAQ, study guide, infographic, slide deck, Audio Overview, Video Overview, quiz, flashcards, notes, mind map, verification prompts, and creative use cases.
```

## MCP Tools

### `build_source_pack`

Create a clean Markdown source pack for NotebookLM copied-text ingestion.

Use it when you have messy notes, CSV summaries, transcripts, operational facts, research excerpts, or analysis output that should become a reliable NotebookLM source.

### `build_studio_prompt`

Create a detailed NotebookLM Studio prompt for:

- Data Table
- Infographic
- Slide Deck
- Audio Overview
- Video Overview
- Report
- Quiz
- Flashcards
- Mind Map

The output includes audience, tone, thesis, required numeric anchors, caveats, structure, visual directions, and decision use.

### `build_artifact_prompt_pack`

Create a full source-to-Studio prompt pack for an entire NotebookLM project. It includes prompts for:

- Source Pack
- Source Guide
- Chat Grounding Check
- Notes
- Data Table
- Report
- Briefing Document
- Study Guide
- FAQ
- Infographic
- Slide Deck
- Audio Overview
- Video Overview
- Flashcards
- Quiz
- Mind Map

It also includes a final verification prompt and optional creative use cases.

### `build_browser_runbook`

Generate a visible-browser workflow for adding sources and creating artifacts. This is useful when the user wants all work to happen through the human-visible NotebookLM UI.

### `suggest_notebook_use_cases`

Generate creative, source-grounded NotebookLM ideas for a domain, audience, and source mix. Use it when a user asks for interesting workflows, "wow me" output ideas, or examples for a public demo.

### `validate_source_pack`

Check a source pack for missing:

- title,
- objective,
- evidence boundary,
- facts,
- definitions,
- assumptions,
- caveats,
- grounding questions.

It also flags deterministic language like "always," "never," or "guarantee" when uncertainty should be visible.

### `split_copied_text_sources`

Split long text into NotebookLM-friendly copied-text chunks with stable part titles.

## MCP Resources

- `google-notebook://workflow`
- `google-notebook://studio-patterns`
- `google-notebook://agentic-usage`
- `google-notebook://artifact-prompt-library`
- `google-notebook://cool-use-cases`
- `google-notebook://safety`

## MCP Prompts

- `notebook-grounding-check`
- `source-pack-builder`
- `studio-artifact-director`
- `full-notebook-generation-plan`
- `use-case-brainstorm`

## Research-Backed Guide

See [docs/agentic-notebook-generation.md](docs/agentic-notebook-generation.md) for the full workflow, research basis, artifact prompt library, verification prompts, and creative use cases.

## Reusable Agent Skill

The skill lives here:

```text
skills/google-notebook-evergreen/SKILL.md
```

Copy that folder into your agent's skills directory, or package it with your plugin system.

The repo also includes cross-agent instruction files:

- `AGENTS.md` for OpenAI/Codex-style agents.
- `CLAUDE.md` for Claude-style agents.
- `GEMINI.md` for Gemini-style agents.
- `.cursor/rules/evergreen-notebook.mdc` for Cursor-style IDE agents.

## Example Workflow

1. Ask your agent to use `build_source_pack` on raw notes.
2. Add the generated Markdown through NotebookLM **Copied text**.
3. Ask NotebookLM a grounding question:

   ```text
   List the current source titles, summarize the highest-confidence findings, and list caveats before recommendations.
   ```

4. Use `build_studio_prompt` for the artifact you want.
5. Paste the prompt into NotebookLM Studio customization.
6. Generate the artifact.
7. Verify numbers and caveats against the source pack.

## Design Philosophy

This project is intentionally not a NotebookLM scraper. It sits one layer earlier:

```text
messy evidence -> clean source packs -> visible NotebookLM UI -> grounded Studio outputs
```

That makes it durable across frontier models and safer for real-world work.

## Development

```bash
npm run check
npm run smoke
```

The server is dependency-free by design. It implements the small MCP surface needed for tools, resources, and prompts directly over newline-delimited stdio JSON-RPC.

## Publishing Checklist

Before publishing a fork or release:

- run `npm run check`,
- run `npm run smoke`,
- scan for secrets and private data,
- verify examples are synthetic,
- test the MCP in at least one client,
- keep the README clear that this is unofficial and not affiliated with Google.

## Status

Unofficial community project. Not affiliated with Google or NotebookLM.
