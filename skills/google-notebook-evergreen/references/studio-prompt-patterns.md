# Studio Prompt Patterns

Use Studio as a source-grounded production line. Stabilize facts with a Data Table or report before asking for more polished multimedia outputs.

## Shared Prompt Block

```text
Audience: [who this is for]
Objective: [what the artifact should help decide or understand]
Evidence boundary: [date range/source limits]
Required numbers: [exact anchors]
Required caveats: [uncertainty/missing data/do-not-overclaim notes]
Guardrail: Use only selected sources. If unsupported, say "not in source."
```

## Data Table

Ask for decision-grade columns: item, date/source, metric or claim, value/details, evidence cue, confidence, caveat, practical meaning, follow-up question.

Use for scattered facts, comparisons, action items, timelines, and exports to Sheets.

## Report

Use a structured thesis with sections for evidence, limitations, competing interpretations, action plan, and an evidence/caveat table.

Ask the report to keep caveats beside the claims they qualify.

## Briefing Document

Ask for: what we know, what changed, why it matters, what is uncertain, decision options, risks, and next best evidence.

Use this when the artifact is for a busy operator or executive.

## Study Guide and FAQ

Ask for learning objectives, key terms, examples, common misconceptions, skeptical questions, and where to look in the sources.

Use this for onboarding, training, stakeholder alignment, or exam prep.

## Infographic

Give a title, audience, orientation, level of detail, visual zones, required numbers, and a caveat strip. Use dashboard language for operational analysis and avoid poster-style fluff.

## Slide Deck

Specify a story arc: human question, data boundary, trend, bottleneck, comparison, decision playbook, caveats, next data to collect.

Choose presenter slides for spoken delivery and detailed deck when the PDF must stand alone.

## Audio Overview

Give hosts a role and opening human question. Choose Deep Dive, Brief, Critique, or Debate. Ask them to explain the distinction between historical probability and prediction in plain language.

## Video Overview

Specify format, style, scene order, narration tone, and the exact misconception the video should correct. Video should explain the evidence structure, not merely decorate the topic.

## Quiz and Flashcards

Test reasoning. Include traps where the correct answer rejects overclaiming, false precision, or unsupported predictions.

## Mind Map

NotebookLM may not expose custom prompting for mind maps. If so, improve the source pack and selected sources before generating the map. Treat the map as a structure discovery tool, not a proof.

## Notes

Use notes as durable working memory. Save high-quality chat answers, source guides, decision logs, and reusable prompts. Convert notes to sources only when they should influence future artifacts.
