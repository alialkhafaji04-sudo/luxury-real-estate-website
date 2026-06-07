# Project Rules

## 0. CRITICAL: Stop and ask before high-risk operations

If you are about to do any of the following, STOP and ask for explicit approval first. Do not "just do it" even if it seems obviously correct. Do not assume an auto-approve classifier is permission.

- Deleting any file (rm, rm -rf, removing from git, mv that overwrites)
- Installing, upgrading, or removing dependencies
- Modifying database schema, auth, or API contracts
- Changing build config (tsconfig, vite, next.config, package.json scripts), env files, or CI workflows
- Committing more than one logical change in a single commit
- Pushing to a remote branch
- Force-pushing, rebasing shared history, or any destructive git operation

For each: explain what you are about to do, why, and what will be affected. Wait for explicit user approval before executing.

If you make a mistake (deleted the wrong file, committed the wrong thing, edited the wrong line), STOP immediately and report it. Do not silently take additional actions to "fix" it. The user decides how to recover.

## 1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that ar't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

**One commit per logical change.** Never bundle unrelated features into a single commit. If you have changed feature A, feature B, and fixed a bug, that is three commits. The commit message should describe ONE thing. If you find yourself writing a commit message with "+" or "and" connecting multiple concepts, split it into multiple commits.

## 4. Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. Versions, Context7, and High-Risk Operations

**State assumed versions before writing code.**
Before writing code that uses any library or framework, state which version you're assuming. If unsure, check `package.json` / lockfile first. Never write code against an unconfirmed version.

**Context7 is for docs only.**
Use Context7 for documentation, API signatures, library setup, syntax, and version-specific debugging. It is never a reason to upgrade deps, change architecture, or refactor working code.

**These operations require explicit approval — explain impact, wait for yes:**
- installing, upgrading, or removing dependencies
- changing auth, database schema, or API contracts
- modifying config (tsconfig, build, env, CI)
- deleting ies to rm, git rm, and mv operations that overwrite)
- making commits that bundle more than one logical change
- pushing to remote branches or force-pushing
- taking "correction" actions after a mistake without re-confirming with the user
