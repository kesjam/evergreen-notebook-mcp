# Security

Evergreen Notebook MCP is designed to be local and low-risk.

## Security Model

- The MCP server does not call Google APIs.
- The MCP server does not access browser cookies.
- The MCP server does not read local files unless a future contributor explicitly adds that feature.
- The MCP server returns generated text, prompts, checklists, and runbooks.

## Sensitive Data

Do not paste secrets, credentials, private medical/legal/financial data, or work-system records into public issues. If you need to discuss sensitive data handling, describe the shape of the data rather than the data itself.

## Reporting Issues

Open a GitHub issue with:

- affected version or commit,
- reproduction steps,
- expected behavior,
- actual behavior,
- any relevant logs with secrets removed.

