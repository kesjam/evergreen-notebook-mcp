#!/usr/bin/env node

const SERVER_NAME = "evergreen-notebook-mcp";
const SERVER_VERSION = "0.1.0";
const DEFAULT_PROTOCOL = "2025-11-25";

const ALL_ARTIFACT_TYPES = [
  "source_pack",
  "source_guide",
  "chat_grounding",
  "notes",
  "data_table",
  "report",
  "briefing_doc",
  "study_guide",
  "faq",
  "infographic",
  "slide_deck",
  "audio_overview",
  "video_overview",
  "flashcards",
  "quiz",
  "mind_map"
];

const ARTIFACT_LABELS = {
  source_pack: "Source Pack",
  source_guide: "Source Guide",
  chat_grounding: "Chat Grounding Check",
  notes: "Notes",
  data_table: "Data Table",
  report: "Report",
  briefing_doc: "Briefing Document",
  study_guide: "Study Guide",
  faq: "FAQ",
  infographic: "Infographic",
  slide_deck: "Slide Deck",
  audio_overview: "Audio Overview",
  video_overview: "Video Overview",
  flashcards: "Flashcards",
  quiz: "Quiz",
  mind_map: "Mind Map"
};

const AGENTIC_USAGE_TEXT = `# Agentic NotebookLM Usage

Use NotebookLM as a source-grounded studio, not as a generic chatbot.

## Research-Backed Loop

1. Define the decision, audience, evidence boundary, and success criteria.
2. Prepare source packs with facts, definitions, assumptions, caveats, and suggested questions.
3. Add sources through the visible UI when privacy or workplace boundaries matter.
4. Ask a grounding check before generating Studio artifacts.
5. Generate table/report artifacts before narrative or multimedia artifacts.
6. Customize every artifact with audience, thesis, numeric anchors, source focus, caveats, and output format.
7. Verify outputs by asking what is unsupported, missing, or easy to misread.

## Prompt Anatomy

Use this structure for most NotebookLM prompts:

- Role: what kind of analyst, teacher, storyteller, or reviewer the artifact should emulate.
- Task: the exact artifact and what it must accomplish.
- Context: audience, source titles, evidence boundary, definitions, and assumptions.
- Requirements: columns, sections, beats, visual style, length, tone, and required caveats.
- Guardrail: use only selected sources; say "not in source" when evidence is missing.
- Verification: list numeric anchors, caveats, and confidence notes.

## Agentic Patterns

- Prompt chaining: source pack -> grounding check -> table/report -> multimedia/story artifacts.
- Routing: send quantitative work to Data Tables, teaching work to study aids, executive work to reports/slides, emotional orientation to audio/video.
- Parallelization: draft artifact prompts independently, then compare them for contradictions.
- Evaluator-optimizer: after each artifact, ask NotebookLM to critique unsupported claims and regenerate with tighter instructions.
- Human checkpoint: confirm before publishing, sharing, or moving sensitive data to a new destination.
`;

const ARTIFACT_LIBRARY_TEXT = `# NotebookLM Artifact Prompt Library

## Data Table
Ask for explicit rows and columns. Include evidence, confidence, caveat, and practical meaning columns so the table can be exported and audited.

## Reports
Give the report a thesis, source boundary, evidence map, limits, competing interpretations, and action plan. Use "not in source" for unsupported claims.

## Briefing Document
Optimize for a busy decision-maker: what changed, why it matters, what is uncertain, and what to do next.

## Study Guide, FAQ, Quiz, Flashcards
Teach the material and test judgment. Include traps that reject false certainty and unsupported extrapolation.

## Infographic
Specify orientation, detail level, visual zones, exact numeric anchors, and a caveat strip. Ask for a useful visual summary rather than decoration.

## Slide Deck
Specify the story arc, deck format, audience, length, source boundary, and what each slide should make easier to decide.

## Audio Overview
Choose a format such as deep dive, brief, critique, or debate. Give hosts a role, listener context, tone, focus, and uncertainty language.

## Video Overview
Choose format, visual style, scene order, narration tone, and the misconception the video should correct. Expect generation to take longer than other artifacts.

## Mind Map
If custom prompting is unavailable, improve source packs and selected sources before generating. Use it to discover structure, not to prove conclusions.

## Notes
Use notes as working memory. Save useful chat answers, then convert notes to sources when they should influence future artifacts.
`;

const COOL_USE_CASES_TEXT = `# Cool NotebookLM Use Cases

- Decision room: source packs, data table, briefing doc, slide deck, and grounding questions for a real decision.
- Pattern detective: operational logs or historical records turned into probability windows, caveat-aware infographics, and "what would change the answer" checks.
- Meeting-to-execution: transcripts into action tables, owner risk maps, follow-up briefs, and stakeholder audio summaries.
- Competitive teardown: pricing pages, docs, reviews, and changelogs into comparison tables, debate audio, and executive slides.
- Study cockpit: syllabus, notes, readings, and past exams into a mind map, flashcards, quizzes, and misconception reports.
- Research dossier: papers and reports into evidence tables, gaps, and visual abstracts.
- Onboarding simulator: policy docs and workflows into role-specific FAQs, scenario quizzes, and "day one" video explainers.
- Incident review: logs, timelines, retrospectives, and policies into root-cause tables, briefing docs, and corrective-action decks.
- Creator studio: long research corpus into a script outline, critique audio, visual explainer, FAQ, and reusable source-backed content calendar.
- Personal knowledge base: receipts, notes, manuals, plans, and preferences into searchable projects with grounded summaries and checklists.
`;

const resources = {
  "google-notebook://workflow": {
    name: "Google Notebook Evergreen Workflow",
    mimeType: "text/markdown",
    text: `# Google Notebook Evergreen Workflow

1. Prepare source packs before opening NotebookLM.
2. Use visible browser UI for personal NotebookLM.
3. Prefer Copied text when file upload or native pickers are fragile.
4. Customize Studio artifacts with audience, thesis, numbers, caveats, and purpose.
5. Ask a grounding chat question after every source batch.
6. Verify numeric claims and call out missing data before recommendations.
`
  },
  "google-notebook://studio-patterns": {
    name: "NotebookLM Studio Prompt Patterns",
    mimeType: "text/markdown",
    text: ARTIFACT_LIBRARY_TEXT
  },
  "google-notebook://agentic-usage": {
    name: "Agentic NotebookLM Usage Tips",
    mimeType: "text/markdown",
    text: AGENTIC_USAGE_TEXT
  },
  "google-notebook://artifact-prompt-library": {
    name: "NotebookLM Artifact Prompt Library",
    mimeType: "text/markdown",
    text: ARTIFACT_LIBRARY_TEXT
  },
  "google-notebook://cool-use-cases": {
    name: "Cool NotebookLM Use Cases",
    mimeType: "text/markdown",
    text: COOL_USE_CASES_TEXT
  },
  "google-notebook://safety": {
    name: "NotebookLM Safety and Boundary Notes",
    mimeType: "text/markdown",
    text: `# Safety and Boundary Notes

- Personal NotebookLM: visible browser UI by default.
- Enterprise NotebookLM: official API only with confirmed project/location/auth.
- Work sites: do not use hidden APIs when the user asks for human-visible behavior.
- Sensitive data: confirm before transmitting it to a new destination.
- Probability: distinguish historical frequency from prediction.
- Sources: mark missing data clearly instead of inventing.
`
  }
};

const toolDefinitions = [
  {
    name: "build_source_pack",
    title: "Build Notebook Source Pack",
    description: "Create a clean Markdown source pack for NotebookLM Copied text ingestion.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["title", "objective", "facts"],
      properties: {
        title: { type: "string", description: "Notebook source title." },
        objective: { type: "string", description: "What this source helps the notebook answer." },
        evidenceBoundary: { type: "string", description: "Date range, extraction method, or source limits." },
        facts: { type: "array", items: { type: "string" }, description: "High-confidence facts." },
        definitions: {
          type: "object",
          additionalProperties: { type: "string" },
          description: "Term-to-definition mapping."
        },
        assumptions: { type: "array", items: { type: "string" } },
        caveats: { type: "array", items: { type: "string" } },
        questions: { type: "array", items: { type: "string" } }
      }
    }
  },
  {
    name: "build_studio_prompt",
    title: "Build Studio Prompt",
    description: "Create a detailed NotebookLM Studio prompt for a specific artifact.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["artifactType", "title", "thesis"],
      properties: {
        artifactType: {
          type: "string",
          enum: ALL_ARTIFACT_TYPES
        },
        title: { type: "string" },
        thesis: { type: "string" },
        audience: { type: "string" },
        tone: { type: "string" },
        requiredNumbers: { type: "array", items: { type: "string" } },
        requiredCaveats: { type: "array", items: { type: "string" } },
        sections: { type: "array", items: { type: "string" } },
        visualDirections: { type: "array", items: { type: "string" } },
        decisionUse: { type: "string", description: "What the artifact should help decide." }
      }
    }
  },
  {
    name: "build_artifact_prompt_pack",
    title: "Build Full Artifact Prompt Pack",
    description: "Create a complete NotebookLM prompt pack for source prep, chat, Studio artifacts, study outputs, multimedia, and verification.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["title", "objective"],
      properties: {
        title: { type: "string", description: "Notebook or project title." },
        objective: { type: "string", description: "Decision, learning goal, or production goal for the notebook." },
        thesis: { type: "string", description: "Core claim or hypothesis to test against sources." },
        audience: { type: "string", description: "Who the notebook outputs are for." },
        evidenceBoundary: { type: "string", description: "Date range, source limits, collection method, or confidence boundary." },
        decisionUse: { type: "string", description: "What the artifacts should help someone decide or understand." },
        tone: { type: "string", description: "Preferred tone for generated prompts." },
        sourceTitles: { type: "array", items: { type: "string" }, description: "Known or planned NotebookLM source titles." },
        keyFacts: { type: "array", items: { type: "string" }, description: "Facts or numeric anchors that artifacts should preserve." },
        caveats: { type: "array", items: { type: "string" }, description: "Required caveats, assumptions, or missing-data notes." },
        artifactTypes: { type: "array", items: { type: "string", enum: ALL_ARTIFACT_TYPES }, description: "Artifacts to include. Defaults to all." },
        includeUseCases: { type: "boolean", default: true, description: "Include creative use-case ideas at the end." }
      }
    }
  },
  {
    name: "build_browser_runbook",
    title: "Build Notebook Browser Runbook",
    description: "Generate a safe visible-browser runbook for adding sources and generating Studio artifacts.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        notebookUrl: { type: "string" },
        sourceMode: { type: "string", enum: ["copied_text", "upload_files", "websites", "drive"], default: "copied_text" },
        sourceTitles: { type: "array", items: { type: "string" } },
        studioArtifacts: { type: "array", items: { type: "string" } },
        verificationQuestion: { type: "string" }
      }
    }
  },
  {
    name: "suggest_notebook_use_cases",
    title: "Suggest NotebookLM Use Cases",
    description: "Generate creative, source-grounded NotebookLM use cases for a domain, audience, and source mix.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        domain: { type: "string", description: "Domain or project area." },
        audience: { type: "string", description: "Who will use the notebook." },
        goals: { type: "array", items: { type: "string" }, description: "Desired outcomes." },
        sourceTypes: { type: "array", items: { type: "string" }, description: "Available source types." },
        count: { type: "number", default: 10 },
        riskLevel: { type: "string", enum: ["low", "medium", "high"], default: "medium" }
      }
    }
  },
  {
    name: "validate_source_pack",
    title: "Validate Notebook Source Pack",
    description: "Check a source pack for missing objective, evidence boundary, caveats, assumptions, definitions, and overclaiming risks.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["text"],
      properties: {
        text: { type: "string" },
        strictness: { type: "string", enum: ["light", "normal", "strict"], default: "normal" }
      }
    }
  },
  {
    name: "split_copied_text_sources",
    title: "Split Copied Text Sources",
    description: "Split long text into NotebookLM Copied text chunks with stable titles.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true
    },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["titlePrefix", "text"],
      properties: {
        titlePrefix: { type: "string" },
        text: { type: "string" },
        maxChars: { type: "number", default: 18000 }
      }
    }
  }
];

const promptDefinitions = [
  {
    name: "notebook-grounding-check",
    description: "Ask NotebookLM to verify sources, summarize findings, and list caveats.",
    arguments: [
      { name: "focus", description: "Topic or decision to ground.", required: false }
    ]
  },
  {
    name: "source-pack-builder",
    description: "Prompt an agent to convert raw notes into NotebookLM-ready source packs.",
    arguments: [
      { name: "topic", description: "Notebook topic.", required: true }
    ]
  },
  {
    name: "studio-artifact-director",
    description: "Prompt an agent to create detailed Studio prompts for every artifact.",
    arguments: [
      { name: "artifact", description: "Artifact type.", required: true },
      { name: "decision", description: "Decision the artifact should support.", required: false }
    ]
  },
  {
    name: "full-notebook-generation-plan",
    description: "Prompt an agent to create a full source-to-Studio NotebookLM generation plan.",
    arguments: [
      { name: "topic", description: "Notebook topic.", required: true },
      { name: "audience", description: "Target audience.", required: false }
    ]
  },
  {
    name: "use-case-brainstorm",
    description: "Prompt an agent to generate creative but source-grounded NotebookLM use cases.",
    arguments: [
      { name: "domain", description: "Domain or project area.", required: true },
      { name: "audience", description: "Target audience.", required: false }
    ]
  }
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function asList(items = []) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- Not specified.";
}

function asNumberList(items = []) {
  return items.length ? items.map((item, index) => `${index + 1}. ${item}`).join("\n") : "1. Summarize the strongest findings and caveats.\n2. What evidence is missing before recommendations?\n3. Where could the pattern be misunderstood?";
}

function buildSourcePack(args) {
  const definitions = args.definitions || {};
  const definitionLines = Object.keys(definitions).length
    ? Object.entries(definitions).map(([term, value]) => `- ${term}: ${value}`).join("\n")
    : "- Not specified.";
  return `# ${args.title}

Prepared: ${todayIso()}
Purpose: ${args.objective}
Evidence boundary: ${args.evidenceBoundary || "Not specified."}

## High-Confidence Facts
${asList(args.facts)}

## Definitions
${definitionLines}

## Assumptions
${asList(args.assumptions)}

## Caveats and Limits
${asList(args.caveats)}

## Suggested Notebook Questions
${asNumberList(args.questions)}
`;
}

function artifactLabel(type) {
  return ARTIFACT_LABELS[type] || type.split("_").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
}

function buildStudioPrompt(args) {
  const label = artifactLabel(args.artifactType);
  const sections = args.sections?.length
    ? `Build it with these sections or beats:\n${asNumberList(args.sections)}\n\n`
    : "";
  const visuals = args.visualDirections?.length
    ? `Visual or format directions:\n${asList(args.visualDirections)}\n\n`
    : "";
  const caveats = args.requiredCaveats?.length
    ? asList(args.requiredCaveats)
    : "- Historical analysis is not prediction.\n- Use 'not in source' instead of inventing missing facts.\n- Keep uncertainty visible near each claim.";
  const numbers = args.requiredNumbers?.length ? asList(args.requiredNumbers) : "- Use only numbers present in selected sources.";

  return `Create a ${label} titled "${args.title}".

Audience: ${args.audience || "A practical reader who needs decision-grade analysis."}
Tone: ${args.tone || "Clear, careful, and evidence-based."}
Thesis: ${args.thesis}
Decision this should support: ${args.decisionUse || "Help the reader decide what the evidence does and does not justify."}

Required numeric anchors:
${numbers}

Required caveats:
${caveats}

${sections}${visuals}Use only selected notebook sources. Do not overclaim. Make the artifact useful without requiring the reader to know the backstory.`;
}

function selectedArtifacts(args) {
  const requested = args.artifactTypes?.length ? args.artifactTypes : ALL_ARTIFACT_TYPES;
  return [...new Set(requested)].filter((type) => ALL_ARTIFACT_TYPES.includes(type));
}

function sourceFocus(args) {
  return args.sourceTitles?.length
    ? args.sourceTitles.map((title) => `- ${title}`).join("\n")
    : "- Use the currently selected sources. If the artifact needs a source that is not selected, say so.";
}

function sharedArtifactContext(args) {
  return `Notebook title: ${args.title}
Objective: ${args.objective}
Audience: ${args.audience || "People who need a clear, source-grounded answer."}
Evidence boundary: ${args.evidenceBoundary || "State the evidence boundary from the selected sources before making claims."}
Working thesis or hypothesis: ${args.thesis || "Identify the strongest source-backed pattern and the strongest caveat."}
Decision/use: ${args.decisionUse || "Help the reader understand what the evidence supports, what remains uncertain, and what to do next."}
Tone: ${args.tone || "Clear, specific, practical, and careful with uncertainty."}

Source focus:
${sourceFocus(args)}

Required facts or numeric anchors:
${asList(args.keyFacts)}

Required caveats:
${args.caveats?.length ? asList(args.caveats) : "- Use only selected sources.\n- Mark missing evidence as \"not in source.\"\n- Separate historical frequency, correlation, and prediction.\n- Keep caveats near the claims they qualify."}`;
}

function artifactSpecificPrompt(type, args) {
  const context = sharedArtifactContext(args);
  const title = `${args.title} - ${artifactLabel(type)}`;
  const guardrail = "Use only selected notebook sources. If a fact, number, or causal claim is not in the sources, write \"not in source\" instead of inferring it.";

  const prompts = {
    source_pack: `Create a copied-text source pack titled "${title}".

${context}

Include: purpose, evidence boundary, definitions, source inventory, high-confidence facts, assumptions, caveats, missing data, and five grounding questions.
${guardrail}`,

    source_guide: `Create a Source Guide for "${args.title}".

${context}

For each source, list what it is best for, what it should not be used to prove, important dates or scopes, high-value facts, and conflicts with other sources.
End with a "best selected-source sets" section for tables, reports, visuals, audio, video, and study aids.
${guardrail}`,

    chat_grounding: `Answer as a grounding check before any Studio generation.

${context}

Return: current source titles, the five strongest findings, exact numeric anchors, contradictions, weak spots, missing data, and claims that would be overreach.
Then suggest which sources should be selected for the next artifact.
${guardrail}`,

    notes: `Create a durable working note titled "${title}".

${context}

Make the note useful as future source material: concise headings, key findings, decision log, open questions, caveats, and prompts to reuse.
Flag any unsupported or ambiguous claim.
${guardrail}`,

    data_table: `Create a Data Table titled "${title}".

${context}

Rows should represent the most decision-relevant entities, events, periods, or patterns. Columns must include: item, source/date, metric or claim, value/details, evidence quote or citation cue, confidence, caveat, practical meaning, and follow-up question.
Design the table so it can be exported to Sheets and audited later.
${guardrail}`,

    report: `Create a custom report titled "${title}".

${context}

Structure: executive thesis, evidence boundary, pattern summary, evidence table, strongest counter-interpretations, gaps, recommended next questions, and a one-page decision brief.
Keep numbers exact. Put caveats beside the claims they qualify.
${guardrail}`,

    briefing_doc: `Create a briefing document titled "${title}".

${context}

Write for a busy decision-maker. Cover: what we know, what changed, why it matters, what is uncertain, decision options, risks, and next best evidence to collect.
Use tight headings and source-backed language.
${guardrail}`,

    study_guide: `Create a Study Guide titled "${title}".

${context}

Include learning objectives, key terms, concept map outline, examples from sources, common misconceptions, short-answer practice questions, and an answer key that cites evidence.
Make uncertainty and limits part of what the learner must understand.
${guardrail}`,

    faq: `Create an FAQ titled "${title}".

${context}

Prioritize questions a smart skeptical reader would ask. Include direct answers, source-backed details, what is not yet known, and "where to look in the sources" hints.
Include at least three uncomfortable questions that test the weak points.
${guardrail}`,

    infographic: `Create an Infographic titled "${title}".

${context}

Use a clear information design: headline insight, three to five visual zones, exact numeric anchors, comparison or timeline where useful, and a visible caveat strip.
Style should serve the domain; avoid decorative filler. Make it understandable in 30 seconds and still useful in three minutes.
${guardrail}`,

    slide_deck: `Create a Slide Deck titled "${title}".

${context}

Use a story arc: question, source boundary, top pattern, evidence, comparison, bottleneck or surprise, decision options, caveats, and next data to collect.
Prefer presenter slides when the deck will be spoken and detailed deck when it must stand alone.
Each slide should have one job.
${guardrail}`,

    audio_overview: `Create an Audio Overview titled "${title}".

${context}

Preferred format: Deep Dive unless a brief, critique, or debate better matches the audience. The hosts should sound like careful analysts: warm, plain-spoken, and honest about uncertainty.
Open with the human question, explain the strongest pattern, challenge it, and end with what a listener should watch next.
${guardrail}`,

    video_overview: `Create a Video Overview titled "${title}".

${context}

Preferred format: Explainer unless a Brief is better for the audience. Use a visual style that makes structure and evidence legible. Scene order: the human question, source boundary, pattern, evidence, caveat, practical takeaway, next question.
Name the misconception the video must correct and avoid unsupported dramatization.
${guardrail}`,

    flashcards: `Create Flashcards titled "${title}".

${context}

Use medium difficulty unless the learner asks otherwise. Include definition cards, application cards, evidence cards, and caveat cards. Include a few "trap" cards where the correct response rejects false precision or unsupported prediction.
Answers must be short enough to study but specific enough to verify.
${guardrail}`,

    quiz: `Create a Quiz titled "${title}".

${context}

Use medium-to-hard questions. Mix multiple choice, scenario judgment, and short-answer prompts. Test what the sources support, what they do not support, and how to interpret uncertainty.
Include explanations that cite the source-backed reasoning.
${guardrail}`,

    mind_map: `Create or prepare a Mind Map for "${args.title}".

${context}

If direct customization is available, organize branches around: core question, source groups, key patterns, evidence, caveats, decisions, and open questions.
If customization is not available, use this prompt as a source-selection checklist before generating the map.
${guardrail}`
  };

  return prompts[type] || buildStudioPrompt({
    artifactType: type,
    title,
    thesis: args.thesis || args.objective,
    audience: args.audience,
    tone: args.tone,
    requiredNumbers: args.keyFacts,
    requiredCaveats: args.caveats,
    decisionUse: args.decisionUse
  });
}

function suggestUseCases(args = {}) {
  const domain = args.domain || "the user's project";
  const audience = args.audience || "the people using the notebook";
  const sourceTypes = args.sourceTypes?.length ? args.sourceTypes.join(", ") : "documents, notes, tables, transcripts, web pages, and copied text";
  const goals = args.goals?.length ? asList(args.goals) : "- Understand a source-backed pattern.\n- Create useful multimedia artifacts.\n- Decide what to do next.";
  const riskLevel = args.riskLevel || "medium";
  const count = Math.max(3, Math.min(Number(args.count || 10), 20));
  const ideas = [
    ["Decision room", "Turn evidence into a briefing doc, evidence table, options deck, and grounding checks."],
    ["Pattern detective", "Find recurring time, season, behavior, quality, demand, or risk patterns without pretending they are destiny."],
    ["Meeting-to-execution hub", "Convert transcripts into owner/action/risk tables, follow-up notes, and stakeholder summaries."],
    ["Competitive teardown", "Compare products, vendors, pricing, positioning, docs, reviews, and roadmap signals."],
    ["Study cockpit", "Build a mind map, study guide, misconception quiz, flashcards, and audio review."],
    ["Research dossier", "Synthesize papers and reports into evidence tables, gaps, and visual abstracts."],
    ["Onboarding simulator", "Transform policies and workflows into role-specific FAQs, scenario quizzes, and explainer videos."],
    ["Incident review room", "Assemble timelines, logs, and retrospectives into root-cause tables and corrective-action decks."],
    ["Creator studio", "Transform a corpus into content outlines, critique audio, visual explainers, and reusable FAQ assets."],
    ["Customer voice lab", "Analyze calls, tickets, reviews, and surveys into themes, quotes, objections, and scripts."],
    ["Personal operations notebook", "Organize plans, receipts, manuals, travel details, and preferences into checklists and grounded Q&A."],
    ["Grant or proposal war room", "Turn requirements, research, budgets, and prior drafts into compliance matrices and reviewer-facing briefs."],
    ["Policy navigator", "Convert policies, laws, or standards into applicability tables, edge-case FAQs, and training quizzes."],
    ["Board-pack generator", "Create executive summaries, risk tables, metric narratives, and director Q&A from internal source packs."],
    ["Product launch brain", "Unify specs, customer research, support risks, and launch notes into a coordinated artifact set."]
  ];
  const selected = ideas.slice(0, count);
  return `# NotebookLM Use Cases for ${domain}

Audience: ${audience}
Available source types: ${sourceTypes}
Risk level: ${riskLevel}

Goals:
${goals}

${selected.map(([name, description], index) => `## ${index + 1}. ${name}
${description}

Best artifacts: Data Table, briefing doc/report, infographic or slide deck, grounding chat, and one multimedia artifact.
Prompt move: specify audience, source boundary, exact columns or sections, and what the output should help decide.`).join("\n\n")}

Guardrail: keep every use case source-grounded. For high-risk domains, add a verification note and avoid professional advice claims.`;
}

function buildArtifactPromptPack(args) {
  const artifacts = selectedArtifacts(args);
  const prompts = artifacts.map((type) => `## ${artifactLabel(type)}

\`\`\`text
${artifactSpecificPrompt(type, args)}
\`\`\``).join("\n\n");
  const useCases = args.includeUseCases === false ? "" : `\n\n${suggestUseCases({
    domain: args.title,
    audience: args.audience,
    goals: [args.objective, args.decisionUse || "Create a source-grounded multimedia notebook."],
    sourceTypes: args.sourceTitles,
    count: 8
  })}`;

  return `# Full NotebookLM Artifact Prompt Pack: ${args.title}

Prepared: ${todayIso()}

## Operating Loop

1. Add or select the right sources.
2. Run the Chat Grounding Check.
3. Generate Data Table or Report first to stabilize facts.
4. Generate visual, slide, audio, video, study, and map artifacts with explicit prompts.
5. Ask a verification question after every artifact that will be shared or used for decisions.

## Shared Context

${sharedArtifactContext(args)}

## Artifact Prompts

${prompts}

## Final Verification Prompt

\`\`\`text
Using only selected sources, audit the generated artifacts for numeric drift, unsupported claims, missing caveats, source-selection mistakes, and statements that confuse historical patterns with predictions. Return fixes artifact by artifact.
\`\`\`${useCases}
`;
}

function buildRunbook(args) {
  const urlLine = args.notebookUrl ? `1. Open ${args.notebookUrl}.` : "1. Open the target NotebookLM notebook.";
  const mode = args.sourceMode || "copied_text";
  const sourceLines = args.sourceTitles?.length
    ? args.sourceTitles.map((title, i) => `   - Source ${i + 1}: ${title}`).join("\n")
    : "   - Source titles not specified.";
  const artifacts = args.studioArtifacts?.length
    ? args.studioArtifacts.map((name, i) => `${i + 1}. ${name}`).join("\n")
    : "1. Data Table\n2. Infographic\n3. Report or Slide Deck\n4. Audio Overview\n5. Video Overview";
  return `# Visible Browser Runbook

${urlLine}
2. Go to Sources.
3. Click Add sources.
4. Use source mode: ${mode}.
5. Add these sources one at a time:
${sourceLines}
6. Wait until the source count updates.
7. Ask this grounding question:
${args.verificationQuestion || "List the current source titles, summarize the strongest findings, and list caveats before recommendations."}
8. Go to Studio and generate artifacts in this order:
${artifacts}
9. For each customizable artifact, paste a detailed prompt with audience, thesis, numbers, caveats, and decision use.
10. Verify numeric drift against sources before treating an output as final.
`;
}

function validateSourcePack(args) {
  const text = args.text || "";
  const checks = [
    ["title heading", /^#\s+/m],
    ["purpose/objective", /purpose|objective|core question/i],
    ["evidence boundary/date range", /evidence boundary|date range|prepared|extraction|range/i],
    ["facts section", /facts|findings|high-confidence/i],
    ["definitions", /definitions|terms/i],
    ["assumptions", /assumptions/i],
    ["caveats/limits", /caveats|limits|do not overclaim|not predict|uncertain/i],
    ["suggested questions", /questions|ask the notebook|grounding/i]
  ];
  const missing = checks.filter(([, pattern]) => !pattern.test(text)).map(([label]) => label);
  const riskWords = [];
  if (/\bwill\b|\bguarantee\b|\balways\b|\bnever\b/i.test(text)) {
    riskWords.push("Contains deterministic words such as will/guarantee/always/never. Make sure they are justified.");
  }
  if (!/not in source|missing|unknown|caveat|uncertain|historical/i.test(text)) {
    riskWords.push("May not make uncertainty visible enough.");
  }
  const status = missing.length || riskWords.length ? "needs_attention" : "ready";
  return JSON.stringify({ status, missing, warnings: riskWords }, null, 2);
}

function splitCopiedTextSources(args) {
  const maxChars = Math.max(2000, Math.min(Number(args.maxChars || 18000), 50000));
  const paragraphs = String(args.text || "").split(/\n(?=#\s+|##\s+)|\n{2,}/);
  const chunks = [];
  let current = "";
  for (const para of paragraphs) {
    const next = current ? `${current}\n\n${para}` : para;
    if (next.length > maxChars && current) {
      chunks.push(current);
      current = para;
    } else {
      current = next;
    }
  }
  if (current.trim()) chunks.push(current);
  return JSON.stringify({
    count: chunks.length,
    chunks: chunks.map((text, index) => ({
      title: `${args.titlePrefix} - Part ${index + 1}`,
      chars: text.length,
      text
    }))
  }, null, 2);
}

function toolResult(text, structuredContent) {
  return {
    content: [{ type: "text", text }],
    ...(structuredContent ? { structuredContent } : {})
  };
}

async function callTool(name, args = {}) {
  switch (name) {
    case "build_source_pack": {
      const text = buildSourcePack(args);
      return toolResult(text, { markdown: text });
    }
    case "build_studio_prompt": {
      const text = buildStudioPrompt(args);
      return toolResult(text, { prompt: text });
    }
    case "build_artifact_prompt_pack": {
      const text = buildArtifactPromptPack(args);
      return toolResult(text, { markdown: text, artifacts: selectedArtifacts(args) });
    }
    case "build_browser_runbook": {
      const text = buildRunbook(args);
      return toolResult(text, { markdown: text });
    }
    case "suggest_notebook_use_cases": {
      const text = suggestUseCases(args);
      return toolResult(text, { markdown: text });
    }
    case "validate_source_pack": {
      return toolResult(validateSourcePack(args));
    }
    case "split_copied_text_sources": {
      return toolResult(splitCopiedTextSources(args));
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function promptMessages(name, args = {}) {
  if (name === "notebook-grounding-check") {
    const focus = args.focus ? ` for ${args.focus}` : "";
    return `Using only the selected notebook sources, list all current source titles, summarize the highest-confidence findings${focus}, identify caveats and missing data, and separate historical probability from prediction.`;
  }
  if (name === "source-pack-builder") {
    return `Turn the raw notes for ${args.topic || "this notebook"} into one or more NotebookLM-ready source packs. Each source pack must include title, purpose, evidence boundary, facts, definitions, assumptions, caveats, and suggested grounding questions.`;
  }
  if (name === "studio-artifact-director") {
    return `Create a detailed NotebookLM Studio prompt for ${args.artifact || "the requested artifact"}. The prompt must include audience, thesis, exact numeric anchors, caveats, structure, visual directions, and the decision it should support${args.decision ? `: ${args.decision}` : "."}`;
  }
  if (name === "full-notebook-generation-plan") {
    return `Create a full agentic NotebookLM generation plan for ${args.topic || "this topic"}${args.audience ? ` for ${args.audience}` : ""}. Include source packs, source-selection strategy, grounding checks, Data Table, report or briefing document, infographic, slide deck, Audio Overview, Video Overview, flashcards, quiz, mind map, notes, creative use cases, and final verification prompts.`;
  }
  if (name === "use-case-brainstorm") {
    return `Generate creative, source-grounded NotebookLM use cases for ${args.domain || "this domain"}${args.audience ? ` for ${args.audience}` : ""}. For each use case, include source types, best artifacts, a starter prompt, and the verification question that prevents overclaiming.`;
  }
  throw new Error(`Unknown prompt: ${name}`);
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function success(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function failure(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

async function handle(request) {
  if (!request || request.jsonrpc !== "2.0") return;
  const { id, method, params = {} } = request;
  const isNotification = id === undefined || id === null;

  try {
    if (method === "initialize") {
      return success(id, {
        protocolVersion: params.protocolVersion || DEFAULT_PROTOCOL,
        capabilities: {
          tools: { listChanged: false },
          resources: { subscribe: false, listChanged: false },
          prompts: { listChanged: false }
        },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
        instructions: "Prepare Google NotebookLM source packs, Studio prompts, browser runbooks, and verification prompts. This server is frontier-model friendly, stdio-only, local-first, dependency-free, and does not log in to Google or call NotebookLM APIs."
      });
    }
    if (method === "notifications/initialized") return;
    if (method === "notifications/cancelled") return;
    if (method === "ping") return success(id, {});
    if (method === "tools/list") return success(id, { tools: toolDefinitions });
    if (method === "tools/call") {
      const result = await callTool(params.name, params.arguments || params.input || {});
      return success(id, result);
    }
    if (method === "resources/list") {
      return success(id, {
        resources: Object.entries(resources).map(([uri, resource]) => ({
          uri,
          name: resource.name,
          mimeType: resource.mimeType,
          description: resource.text.split("\n").slice(0, 3).join(" ")
        }))
      });
    }
    if (method === "resources/read") {
      const resource = resources[params.uri];
      if (!resource) throw new Error(`Unknown resource: ${params.uri}`);
      return success(id, { contents: [{ uri: params.uri, mimeType: resource.mimeType, text: resource.text }] });
    }
    if (method === "resources/templates/list") return success(id, { resourceTemplates: [] });
    if (method === "prompts/list") return success(id, { prompts: promptDefinitions });
    if (method === "prompts/get") {
      const text = promptMessages(params.name, params.arguments || params.args || {});
      return success(id, {
        description: promptDefinitions.find((prompt) => prompt.name === params.name)?.description || params.name,
        messages: [{ role: "user", content: { type: "text", text } }]
      });
    }
    if (method === "logging/setLevel") return success(id, {});
    if (!isNotification) return failure(id, -32601, `Method not found: ${method}`);
  } catch (error) {
    if (!isNotification) failure(id, -32000, error instanceof Error ? error.message : String(error));
  }
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() || "";
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      void handle(JSON.parse(line));
    } catch (error) {
      failure(null, -32700, error instanceof Error ? error.message : String(error));
    }
  }
});

process.stdin.on("end", () => {
  if (buffer.trim()) {
    try {
      void handle(JSON.parse(buffer));
    } catch (error) {
      failure(null, -32700, error instanceof Error ? error.message : String(error));
    }
  }
});
