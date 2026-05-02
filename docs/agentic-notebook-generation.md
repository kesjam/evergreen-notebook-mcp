# Agentic NotebookLM Generation

This guide turns NotebookLM into a repeatable, source-grounded content studio for frontier LLM agents. The goal is not to automate a user's Google account. The goal is to prepare better sources, better prompts, better artifact sequences, and better verification loops.

## Research Basis

NotebookLM is built around independent notebooks, selected sources, chat, notes, and Studio artifacts. Google documents that Studio can create notes, Audio Overviews, Video Overviews, mind maps, reports, Data Tables, flashcards, quizzes, slide decks, and infographics from uploaded or selected sources. Chat uses source material and citations, and users can include or exclude sources before asking questions. Data Tables can be customized with desired rows and columns and exported to Sheets. Audio and video outputs can be customized by format, language, length or style, and steering prompts. See the official NotebookLM Help pages for [creating notebooks](https://support.google.com/notebooklm/answer/16206563), [adding sources](https://support.google.com/notebooklm/answer/16215270), [chat](https://support.google.com/notebooklm/answer/16179559), [notes](https://support.google.com/notebooklm/answer/16262519), [Audio Overviews](https://support.google.com/notebooklm/answer/16212820), [Video Overviews](https://support.google.com/notebooklm/answer/16454555), [flashcards/quizzes](https://support.google.com/notebooklm/answer/16958963), [slide decks](https://support.google.com/notebooklm/answer/16757456), [infographics](https://support.google.com/notebooklm/answer/16758265), and [mind maps](https://support.google.com/notebooklm/answer/16212283).

Google's NotebookLM updates also emphasize source quality: Deep Research helps build source collections, while newer supported source types include Sheets, Drive URLs, images, PDFs from Drive, and Word documents. Google's Data Tables announcement frames tables as a way to turn scattered source facts into structured rows and columns ready for export. See Google's posts on [Deep Research and source types](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-deep-research-file-types/) and [Data Tables](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-data-tables/).

The prompt patterns here combine those NotebookLM affordances with frontier-model prompting guidance: put important instructions up front, use delimiters, specify context/outcome/format/style, provide examples when useful, add context instead of assuming the model has it, decompose complex work, iterate against success criteria, and use tools with small, clear responsibilities. See [OpenAI prompt engineering best practices](https://help.openai.com/en/articles/6654000-how-to-use-prompt-engineering), [OpenAI reasoning model prompting guidance](https://developers.openai.com/api/docs/guides/reasoning-best-practices), [Google Gemini prompt design strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies), [Anthropic prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), [Anthropic's agent workflow patterns](https://www.anthropic.com/engineering/building-effective-agents), and [OpenAI's practical agent guide](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/).

## The Operating Loop

Use this loop when an agent is building a high-quality notebook:

1. Define the objective: What question should the notebook answer, for whom, and with what decision in mind?
2. Define the evidence boundary: date range, source list, extraction method, known missing fields, and what the notebook must not claim.
3. Prepare source packs: facts, definitions, assumptions, caveats, and grounding questions in copied-text-friendly Markdown.
4. Add sources visibly: use the browser UI for personal NotebookLM and sensitive contexts. This MCP intentionally does not log in or call private NotebookLM APIs.
5. Ask a grounding check: verify source titles, source count, strongest findings, contradictions, missing data, and caveats.
6. Stabilize facts first: generate a Data Table or report before generating audio, video, decks, and visual artifacts.
7. Customize every artifact: specify audience, thesis, required numbers, caveats, structure, visual direction, and decision use.
8. Verify outputs: ask NotebookLM to audit numeric drift, unsupported claims, and statements that blur historical patterns into predictions.

## Prompt Anatomy

Use this shape for most NotebookLM prompts:

```text
Role:
Act as a [careful analyst / teacher / executive briefer / documentary producer].

Task:
Create a [NotebookLM artifact] that helps [audience] decide or understand [objective].

Context:
Selected sources: [source titles]
Evidence boundary: [date range / collection method / source limits]
Working thesis: [claim to test]
Important definitions: [terms]

Requirements:
- Include [columns / sections / scenes / slide arc / card types].
- Preserve these numbers exactly: [anchors].
- Put caveats next to the claims they qualify.
- Use a [tone/style/length].

Guardrail:
Use only selected sources. If something is missing, say "not in source."

Verification:
End with confidence notes, missing evidence, and one question that would change the conclusion.
```

## Artifact Prompt Library

### Source Pack

Use source packs before NotebookLM sees the content. A source pack should be self-contained enough that a future agent or human can understand the source boundary without reading the chat history.

```text
Create a copied-text source pack titled "[Project] - Evidence Pack."
Include purpose, evidence boundary, source inventory, definitions, high-confidence facts, assumptions, caveats, missing data, and suggested grounding questions.
Write it as durable Markdown. Do not include unsupported conclusions.
```

### Source Guide

Use a source guide after sources are added.

```text
Create a source guide for the selected sources. For each source, list what it is best for, what it should not be used to prove, dates or scope, high-value facts, conflicts with other sources, and ideal artifact uses.
End with recommended source selections for Data Table, report, infographic, slide deck, audio, video, study aids, and mind map.
```

### Chat Grounding Check

This is the first chat prompt after adding sources and the last prompt before trusting outputs.

```text
Using only selected sources, list all current source titles, summarize the strongest findings, preserve exact numeric anchors, identify contradictions, list missing evidence, and separate historical frequency from prediction.
Then recommend which sources should be selected for the next artifact.
```

### Notes

Notes are the notebook's working memory. Save grounded chat responses or write your own planning note, then convert notes to sources when they should influence future artifacts.

```text
Create a durable working note with: decision log, key findings, source boundary, open questions, caveats, and reusable artifact prompts.
Keep it concise and source-grounded.
```

### Data Table

Data Tables are ideal for scattered facts, comparisons, timelines, metrics, action items, and evidence audits.

```text
Create a Data Table titled "[Title]."
Rows: [entities/events/periods/patterns].
Columns: item, date/source, metric or claim, value/details, evidence cue, confidence, caveat, practical meaning, follow-up question.
Make it export-friendly for Sheets. Use only selected sources.
```

### Report

Reports work best after a table or grounding check has stabilized the evidence.

```text
Create a custom report for [audience].
Structure: executive thesis, evidence boundary, pattern summary, evidence table, counter-interpretations, gaps, recommendations, and next data to collect.
Keep caveats beside the claims they qualify.
```

### Briefing Document

Use this for leaders or busy operators.

```text
Create a briefing document that answers: what we know, what changed, why it matters, what is uncertain, what options exist, what risks matter, and what evidence would change the decision.
Use concise headings and direct language.
```

### Study Guide

Use this when the notebook should teach, onboard, or train.

```text
Create a study guide with learning objectives, key terms, source-backed examples, concept outline, common misconceptions, practice questions, and answer key.
Include uncertainty and "not in source" examples as teachable concepts.
```

### FAQ

Use this for skeptical readers and stakeholder alignment.

```text
Create an FAQ for a skeptical reader.
Include direct answers, source-backed details, caveats, where to look in the sources, and three uncomfortable questions that test weak evidence.
```

### Infographic

Infographics should be information design, not decoration.

```text
Create an infographic titled "[Title]."
Audience: [audience].
Orientation: [square / portrait / landscape].
Level of detail: [concise / standard / detailed].
Visual zones: headline insight, source boundary, key numbers, comparison or timeline, caveat strip, next question.
Use exact numbers from selected sources. Avoid filler art.
```

### Slide Deck

Decide whether the deck is for presenting or reading.

```text
Create a [Presenter Slides / Detailed Deck] slide deck.
Story arc: human question, source boundary, top pattern, evidence, comparison, surprise, decision options, caveats, next data to collect.
Each slide should have one job and one main claim.
```

### Audio Overview

Audio is good for emotional orientation, deep dives, critiques, and debates.

```text
Create an Audio Overview in [Deep Dive / Brief / Critique / Debate] format.
The hosts should act as careful analysts for [audience].
Open with the human question, explain the strongest pattern, challenge the pattern, distinguish historical frequency from prediction, and end with what to watch next.
Tone: plain-spoken, grounded, and honest about uncertainty.
```

### Video Overview

Video is strongest when the prompt gives scene order and the misconception to correct.

```text
Create a Video Overview in [Explainer / Brief / Cinematic if available] format.
Visual style: [classic / whiteboard / professional / custom style].
Scene order: human question, source boundary, pattern, evidence, caveat, practical takeaway, next question.
Correct this misconception: [misconception].
Do not dramatize beyond the selected sources.
```

### Flashcards

```text
Create flashcards at [easy / medium / hard] difficulty.
Include definition cards, application cards, evidence cards, caveat cards, and trap cards where the correct response rejects unsupported certainty.
Keep answers short but verifiable.
```

### Quiz

```text
Create a quiz at [easy / medium / hard] difficulty.
Mix multiple choice, scenario judgment, and short-answer questions.
Test what the sources support, what they do not support, and how to reason about uncertainty.
Include explanations.
```

### Mind Map

Mind maps may offer less prompt control than other artifacts. Improve the selected sources first.

```text
Prepare a mind map around: core question, source groups, key patterns, evidence, caveats, decisions, and open questions.
If direct customization is unavailable, use this as the source-selection checklist before generating the mind map.
```

## Cool Use Cases

- Decision room: source packs, Data Table, briefing doc, slide deck, and verification prompts for a real decision.
- Pattern detective: historical logs turned into probability windows, caveat-aware infographics, and "what would change the answer" checks.
- Meeting-to-execution hub: transcripts into action tables, owner maps, follow-up briefs, and stakeholder summaries.
- Competitive teardown: pricing pages, changelogs, docs, reviews, and collateral into comparison tables, debate audio, and executive slides.
- Study cockpit: syllabus, notes, readings, past exams, flashcards, quizzes, and misconception reports.
- Research dossier: papers and reports into evidence tables, gap analysis, visual abstracts, and cautious summaries.
- Onboarding simulator: policies and workflows into role FAQs, scenario quizzes, and explainer videos.
- Incident review room: timelines, logs, retrospectives, and policies into root-cause tables and corrective-action decks.
- Creator studio: research corpus into content outlines, critique audio, video explainers, FAQs, and a source-backed content calendar.
- Customer voice lab: tickets, reviews, calls, and surveys into theme tables, objection maps, quote banks, and training briefs.
- Grant or proposal war room: requirements, budgets, research, and drafts into compliance matrices and reviewer-facing briefs.
- Board-pack generator: source packs into executive narratives, metric caveats, risk tables, and director Q&A.
- Product launch brain: specs, support risks, customer research, and launch notes into readiness reports and stakeholder decks.
- Personal knowledge base: receipts, plans, manuals, project notes, and preferences into grounded checklists and Q&A.

## Verification Prompts

Use these prompts after important artifacts:

```text
Audit this artifact against selected sources. List numeric drift, unsupported claims, missing caveats, source-selection mistakes, and claims that confuse historical patterns with predictions.
```

```text
What would a skeptical reader challenge? Separate source-backed critiques from missing-data critiques.
```

```text
Which selected source is doing the most work in this answer? Which source is underused? Are any sources irrelevant to this artifact?
```

## Safety Notes

Keep sensitive systems human-visible when requested. Do not call private endpoints, scrape work systems, or move sensitive content to a new destination without confirmation. Treat NotebookLM outputs as source-grounded drafts that still need human review, especially for medical, legal, financial, employment, compliance, or safety-sensitive decisions.
