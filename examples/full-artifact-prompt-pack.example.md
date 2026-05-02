# Example: Full Artifact Prompt Pack Request

Use this with an MCP-capable agent after connecting `evergreen-notebook-mcp`.

```text
Use evergreen-notebook's build_artifact_prompt_pack tool with:

title: "Community Garden Planning Notebook"
objective: "Help a volunteer committee decide which garden plan is most feasible for the next growing season."
audience: "Volunteer organizers and neighborhood partners"
evidenceBoundary: "Synthetic example sources: meeting notes, budget table, site constraints, crop calendar, and volunteer survey."
thesis: "The best plan balances water access, volunteer availability, and low-cost crops rather than maximizing plot count."
decisionUse: "Choose a garden layout and launch plan that can be maintained by the current volunteer base."
sourceTitles:
- "Meeting Notes - Planning Session"
- "Budget Estimate - Synthetic"
- "Site Constraints Summary"
- "Crop Calendar"
- "Volunteer Survey Summary"
keyFacts:
- "Volunteer capacity is the limiting factor in this synthetic example."
- "Water access and shade constraints affect layout choices."
- "Budget should be treated as an estimate, not a final quote."
caveats:
- "Synthetic example only."
- "No real land-use, legal, or safety advice."
- "Confirm costs and permissions before action."
includeUseCases: true
```

Expected output:

- source pack prompt,
- source guide prompt,
- chat grounding prompt,
- notes prompt,
- Data Table prompt,
- report and briefing prompts,
- study guide and FAQ prompts,
- infographic and slide deck prompts,
- Audio and Video Overview prompts,
- quiz and flashcards prompts,
- mind map prompt,
- final verification prompt,
- creative NotebookLM use cases.
