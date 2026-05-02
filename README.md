# Evergreen Notebook MCP

Privacy-safe MCP tools and an agent skill for building better Google NotebookLM notebooks.

This project does **not** log in to Google, read browser cookies, call private NotebookLM endpoints, or scrape work systems. It helps agents prepare high-quality source packs, Studio prompts, browser runbooks, and grounding checks that can be used through the normal visible NotebookLM UI.

## Why This Exists

NotebookLM is strongest when the sources are clean and the prompts are deliberate. Evergreen Notebook MCP makes that repeatable:

- turn messy notes into NotebookLM-ready source packs,
- split large copied-text sources into stable chunks,
- generate detailed Studio prompts for reports, slides, audio, video, infographics, quizzes, and tables,
- create visible-browser runbooks for safe source ingestion,
- validate that source packs include evidence boundaries and caveats.

## What It Does Not Do

- No Google authentication.
- No browser-cookie access.
- No hidden NotebookLM API calls.
- No work-site scraping.
- No claim that historical patterns can predict inherently uncertain events.

## Quick Install

Clone the repo, then point your MCP client at `server.mjs`.

### Codex Config

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

## MCP Tools

`build_source_pack`
: Create a clean Markdown source pack for NotebookLM copied-text ingestion.

`build_studio_prompt`
: Create a detailed Studio prompt for a specific artifact.

`build_browser_runbook`
: Generate a visible-browser workflow for adding sources and creating artifacts.

`validate_source_pack`
: Check a source pack for missing objective, evidence boundary, caveats, and overclaiming risks.

`split_copied_text_sources`
: Split long notes into NotebookLM-friendly copied-text chunks.

## MCP Resources

- `google-notebook://workflow`
- `google-notebook://studio-patterns`
- `google-notebook://safety`

## MCP Prompts

- `notebook-grounding-check`
- `source-pack-builder`
- `studio-artifact-director`

## Agent Skill

The reusable skill lives in:

```text
skills/google-notebook-evergreen/SKILL.md
```

Copy that folder into your agent's skills directory, or package it with your plugin system.

## Example Workflow

1. Use `build_source_pack` to turn raw notes into a dated, caveated source.
2. Add the source through NotebookLM's visible **Copied text** flow.
3. Ask `notebook-grounding-check`.
4. Use `build_studio_prompt` for the artifact you want.
5. Generate the artifact in NotebookLM Studio.
6. Verify numbers and caveats before trusting the output.

## Status

Unofficial community project. Not affiliated with Google or NotebookLM.

