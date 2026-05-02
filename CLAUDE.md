# Claude Instructions

Use this repo as a local MCP server and agent skill for NotebookLM workflows.

Do:

- Generate source packs with evidence boundaries and caveats.
- Generate detailed Studio prompts.
- Use `build_artifact_prompt_pack` for full NotebookLM builds.
- Use `suggest_notebook_use_cases` for creative source-grounded ideas.
- Keep NotebookLM work visible-browser friendly.
- Verify claims against selected sources.

Do not:

- Add hidden Google or NotebookLM API automation.
- Read browser cookies.
- Commit private data or workplace examples.

Validation:

```bash
npm run check
npm run smoke
```
