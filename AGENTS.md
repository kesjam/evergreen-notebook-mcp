# Agent Instructions

This repo provides a privacy-safe MCP server and reusable skill for NotebookLM workflows.

## Priorities

- Keep the server local-first and dependency-free unless a dependency is clearly justified.
- Do not add Google login, cookie scraping, hidden NotebookLM API calls, or work-site scraping.
- Preserve compatibility with generic MCP stdio clients.
- Keep outputs grounded: source packs, prompts, runbooks, caveats, and validation.
- Use examples that are synthetic and safe to publish.

## Validation

Run:

```bash
npm run check
npm run smoke
```

Before release, scan for secrets or workplace-specific content.

