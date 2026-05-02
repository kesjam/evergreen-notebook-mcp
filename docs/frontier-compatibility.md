# Frontier LLM Compatibility

Evergreen Notebook MCP is designed to work with any frontier-model client that supports local MCP stdio servers.

## Compatibility Contract

The server is intentionally conservative:

- stdio transport only,
- newline-delimited JSON-RPC messages,
- no external dependencies,
- no model-specific SDK,
- no Google authentication,
- no browser-cookie access,
- no hidden NotebookLM API calls,
- JSON Schema tool inputs,
- read-only/idempotent tool annotations,
- tools, resources, and prompts only.

## Expected Clients

This project should fit clients in these categories:

- desktop assistants that support MCP,
- coding agents that support MCP,
- IDE agents that support MCP,
- local agent harnesses that can spawn a stdio server,
- future frontier LLM clients that implement MCP tools.

Avoid claiming a client is supported unless you have tested it. If a client can launch:

```bash
node /absolute/path/to/evergreen-notebook-mcp/server.mjs
```

and speak MCP over stdio, it should be able to use the server.

## Agent Instruction Files

The repo ships multiple instruction files so different frontier-agent ecosystems can pick up the same working style:

- `AGENTS.md`: generic/OpenAI Codex-style project instructions.
- `CLAUDE.md`: Claude-style project instructions.
- `GEMINI.md`: Gemini-style project instructions.
- `.cursor/rules/evergreen-notebook.mdc`: Cursor-style IDE rule.

These files do not change the MCP server. They help agents behave consistently when editing or using the repo.

## Why Not Direct NotebookLM Automation?

Direct automation is brittle and often privacy-sensitive. This project instead prepares the artifacts an agent needs to operate NotebookLM through the visible UI:

- clean copied-text sources,
- Studio artifact prompts,
- full artifact prompt packs,
- creative use-case menus,
- browser runbooks,
- grounding questions,
- validation reports.

This approach travels better across models and clients.

## Protocol Tolerance

The server:

- echoes the client's requested protocol version during `initialize`,
- supports `tools/list`, `tools/call`, `resources/list`, `resources/read`, `resources/templates/list`, `prompts/list`, `prompts/get`, `ping`, and `logging/setLevel`,
- ignores normal initialization and cancellation notifications,
- accepts both `arguments` and `input` for tool-call payloads,
- accepts both `arguments` and `args` for prompt payloads.
