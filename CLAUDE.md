**Follow all rules in [AGENTS.md](./AGENTS.md).** That file is the canonical source — Sections 0–5 apply to every change.

What follows is Claude Code-specific only.

## Workflow: Claude Plans, Codex Implements

Claude is the planner. Codex is the implementer.

For any task that requires writing or modifying code:

1. **Claude thinks first.** Read the relevant files, understand the request, identify edge cases.
2. **Claude presents a plan.** State the goal, the files that will change, the approach, and the success criteria. Do NOT start editing.
3. **Wait for the user to approve the plan.** If they push back, refine. Do not implement until approved.
4. **Delegate implementation to Codex** with a precise, self-contained brief: the goal, the files to touch, the exact changes, and the verification step.
5. **Review the output.** Confirm changes match the plan. Report results.

Exceptions — Claude MAY act directly without delegating when:
- The task is read-only (questions, searching, explaining).
- The user explicitly says "just do it" / "skip codex".
- The change is a trivial one-line edit and no plan was requested.

Default: when in doubt, plan first.
