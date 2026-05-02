# Architecture

Evergreen Notebook MCP has two pieces:

1. A dependency-free MCP server exposed over stdio.
2. A reusable agent skill for NotebookLM workflows.

The server only generates text artifacts:

- source packs,
- Studio prompts,
- browser runbooks,
- validation reports,
- prompt templates.

It intentionally avoids direct NotebookLM automation. Browser control should remain in the agent/client layer where the user can see what is happening.

