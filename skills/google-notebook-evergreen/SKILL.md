---
name: google-notebook-evergreen
description: Use this whenever the user asks to create, populate, maintain, prompt, automate, or improve a Google NotebookLM / Google Notebook workflow, including adding sources, preparing source packs, generating Studio outputs, practicing notebook chat, or using the local Google Notebook MCP.
---

# Google Notebook Evergreen

Use this skill for durable NotebookLM work: clean sources first, visible browser actions second, Studio artifacts with explicit prompts, and verification last.

## Decide the path

1. **Personal NotebookLM** (`notebooklm.google.com`): prefer the visible browser UI. Use browser tools to click, paste, inspect, and screenshot. Do not use hidden work-site APIs.
2. **NotebookLM Enterprise** (`notebooklm.cloud.google.com`): use official APIs only after the user confirms Enterprise access, project, location, and auth context.
3. **Local MCP**: use `google-notebook-evergreen` to prepare source packs, Studio prompts, grounding questions, and browser runbooks. This MCP is intentionally local and does not log in, scrape NotebookLM, or touch Google cookies.
4. **Unofficial NotebookLM MCPs**: use only if the user explicitly asks for cookie/browser-state automation.

## Source workflow

Before adding sources, create self-contained source packs:

- title and objective,
- date range or evidence boundary,
- high-confidence facts,
- definitions and assumptions,
- caveats and "do not overclaim" notes,
- desired notebook questions.

If upload is unreliable, use NotebookLM **Copied text** and paste one source pack at a time. If content is large, split it into coherent parts rather than forcing one oversized source.

See `references/source-pack-template.md` when you need a reusable structure.

## Studio workflow

Do not accept generic Studio defaults when the user wants useful outputs. For every artifact that supports customization, give it:

- audience,
- thesis,
- exact numeric anchors,
- required caveats,
- visual or structural directions,
- what the artifact must help the user decide.

Use this order for analysis notebooks: Data Table, Infographic, Slide Deck or Report, Audio Overview, Video Overview, Quiz/Flashcards, then Mind Map if useful. Mind Map may be source-driven with little or no prompt control in the UI.

See `references/studio-prompt-patterns.md` for artifact-specific prompt patterns.

## Verification

After adding sources or generating artifacts:

1. Check the source count and source titles.
2. Ask a grounding chat question:
   `List the current source titles, summarize the highest-confidence findings, and list caveats before recommendations.`
3. Verify numeric claims against the source pack.
4. Call out any drift, missing schedule/history fields, weak evidence, or unsupported predictions.

## Guardrails

- Keep work-site systems human-visible when the user asks for that boundary.
- Do not transmit sensitive data to a new destination without action-time confirmation.
- Do not claim NotebookLM can predict real-world events that are inherently uncertain.
- Do not bury caveats in appendices; place them near the claim they qualify.
- Prefer creating local source packs and prompts over broad web ingestion.

