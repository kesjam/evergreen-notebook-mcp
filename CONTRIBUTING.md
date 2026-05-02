# Contributing

Thanks for making NotebookLM workflows less chaotic.

## Principles

- Keep the MCP local-first and privacy-safe.
- Do not add Google login, cookie scraping, or hidden NotebookLM API calls without a major design discussion.
- Prefer source preparation and visible-browser runbooks over brittle automation.
- Make uncertainty and missing data visible.
- Keep examples generic; do not commit workplace or personal records.

## Development

```bash
npm run check
npm run smoke
```

The server is dependency-free on purpose. If a dependency becomes necessary, explain why in the pull request.

