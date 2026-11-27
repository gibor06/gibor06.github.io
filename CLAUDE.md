# CLAUDE

Compatibility entrypoint for runtimes that auto-detect `CLAUDE.md`.

<!-- KNOWNS GUIDELINES START -->

**CRITICAL: Start with Knowns MCP `initial` when available. Use `help("tool.*")` or `help("workflow.*")` for domain details on demand.**

## Runtime Guidance

- Knowns is the repository memory layer for humans and the AI-friendly working layer for agents.
- MCP `initial` is the primary AI bootstrap: project state, tool domains, code rules, and workflow routing.
- MCP `help` is the primary on-demand source for action schemas and recipes.
- Treat this file only as a lightweight compatibility entrypoint.

## Minimum Rules

- Use Knowns as the canonical system for tasks, docs, templates, and workflow state.
- Never manually edit Knowns-managed task or doc markdown.
- Search first, then read only relevant docs and code.
- Use `search` for discovery; use MCP `retrieve` tool when a workflow needs structured context with citations. Fall back to CLI `knowns retrieve` if MCP is unavailable.
- For code operations, use `code` tool: `find`/`symbols` for structure, `references`/`definition` for navigation, `rename`/`replace`/`replace_body`/`insert`/`delete` for editing. Use `help("code.*")` or `help("workflow.code-edit")` for details.
- Plan before implementation unless the user explicitly overrides that workflow.
- Validate before considering work complete.
- A Memory is a fact the NEXT session needs, written from an outcome you reached. Never from a phrase in a request: a prompt is a request, not a conclusion. If an entry carries nothing beyond the message that prompted it, it is not a Memory.
- `pattern`, `convention` and `failure` are claims about the code, so cite something checkable: a symbol, `@doc/<path>` or `@task-<id>`, never a line number. `preference` is the user's own commitment, so cite who said it and when, and give it a `**Why:**` line; the reason is the only thing that lets a rule apply to a case it does not name.
- Read with `memory({ action: "list" })` at session start. Write with `memory({ action: "add" })` when work settles something durable: a write nothing conflicts with is live at once, while one matching an existing Memory comes back for review instead of overwriting it.

## Quick Reference

```bash
knowns doc list --plain               # List docs
knowns task list --plain              # List tasks
knowns task <id> --plain              # View task
knowns doc "<path>" --plain --smart  # View doc
knowns search "query" --plain        # Search docs/tasks
knowns retrieve "query" --json      # Retrieve structured context pack (CLI fallback)
```

<!-- KNOWNS GUIDELINES END -->
