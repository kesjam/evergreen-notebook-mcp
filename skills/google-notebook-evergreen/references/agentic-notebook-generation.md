# Agentic NotebookLM Generation

Use this reference when a user wants a high-quality NotebookLM, a complete Studio prompt set, multimedia content, or creative use cases.

## Core Loop

1. Define the notebook objective, audience, decision, and evidence boundary.
2. Build source packs before adding content.
3. Add sources visibly when privacy boundaries matter.
4. Ask a grounding check after adding sources.
5. Generate Data Table or report first to stabilize facts.
6. Generate infographic, slide deck, audio, video, study aids, and mind map with explicit prompts.
7. Audit every important artifact for numeric drift, unsupported claims, and missing caveats.

## Prompt Anatomy

Use clear sections:

- Role: analyst, teacher, briefer, producer, reviewer.
- Task: exact artifact and purpose.
- Context: selected sources, source boundary, definitions, assumptions.
- Requirements: columns, sections, scenes, slide arc, difficulty, style, tone.
- Guardrail: use only selected sources; write "not in source" when evidence is missing.
- Verification: exact numbers, caveats, confidence notes, and next evidence to collect.

## Artifact Prompts

### Source Pack

```text
Create a copied-text source pack titled "[Project] - Evidence Pack."
Include purpose, evidence boundary, source inventory, definitions, high-confidence facts, assumptions, caveats, missing data, and suggested grounding questions.
Do not include unsupported conclusions.
```

### Source Guide

```text
For each selected source, list what it is best for, what it should not be used to prove, dates/scope, high-value facts, conflicts, and ideal artifact uses.
End with recommended source selections for Data Table, report, infographic, slide deck, audio, video, study aids, and mind map.
```

### Chat Grounding

```text
Using only selected sources, list source titles, strongest findings, exact numeric anchors, contradictions, missing evidence, caveats, and claims that would be overreach.
Separate historical frequency from prediction.
```

### Data Table

```text
Create a Data Table with columns: item, date/source, metric or claim, value/details, evidence cue, confidence, caveat, practical meaning, follow-up question.
Make it export-friendly for Sheets and auditable later.
```

### Report or Briefing

```text
Create a source-grounded report for [audience].
Structure: thesis, evidence boundary, pattern summary, evidence table, counter-interpretations, gaps, recommendations, next data.
Put caveats beside claims.
```

### Infographic

```text
Create an infographic with headline insight, source boundary, key numbers, comparison or timeline, caveat strip, and next question.
Use exact numbers. Avoid decorative filler.
```

### Slide Deck

```text
Create a [Presenter Slides / Detailed Deck] deck.
Story arc: human question, source boundary, top pattern, evidence, comparison, surprise, decision options, caveats, next data.
Each slide has one job.
```

### Audio Overview

```text
Create an Audio Overview in [Deep Dive / Brief / Critique / Debate] format.
Hosts are careful analysts for [audience].
Open with the human question, explain and challenge the pattern, distinguish historical frequency from prediction, and end with what to watch next.
```

### Video Overview

```text
Create a Video Overview in [Explainer / Brief] format.
Scene order: human question, source boundary, pattern, evidence, caveat, practical takeaway, next question.
Correct this misconception: [misconception].
Do not dramatize beyond selected sources.
```

### Study Aids

```text
Create flashcards and a quiz at [difficulty].
Include definitions, applications, evidence, caveats, scenario judgment, and trap questions that reject unsupported certainty.
Explain answers.
```

### Mind Map

```text
Organize branches around: core question, source groups, key patterns, evidence, caveats, decisions, open questions.
If direct customization is unavailable, use this as the source-selection checklist before generating.
```

## Cool Use Cases

- Decision room: evidence packs, table, briefing, deck, and verification.
- Pattern detective: historical logs into probability windows and caveat-aware visuals.
- Meeting-to-execution hub: transcripts into action tables and stakeholder summaries.
- Competitive teardown: docs, reviews, pricing, and changelogs into comparison assets.
- Study cockpit: readings into map, guide, flashcards, quiz, and misconception report.
- Research dossier: papers into evidence tables, gap analysis, and visual abstracts.
- Onboarding simulator: policies into FAQs, scenario quizzes, and explainer videos.
- Incident review room: timelines and retrospectives into root-cause tables and action decks.
- Creator studio: corpus into scripts, critique audio, visual explainers, and content calendars.
- Customer voice lab: tickets and calls into themes, objections, quotes, and training briefs.

## Verification

```text
Audit this artifact against selected sources. List numeric drift, unsupported claims, missing caveats, source-selection mistakes, and statements that confuse historical patterns with predictions.
```
