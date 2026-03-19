---
name: token-optimization
description: Optimize token usage and context management. Use this skill when starting tasks, planning work, or when context is getting large. Reduces token waste by enforcing efficient patterns.
---

# Token optimization

## Response rules
- Be concise. No preambles, no summaries of what you just did.
- Do NOT re-read files you already have in context. Check conversation history first.
- Do NOT output entire files when only a few lines changed. Show only the diff.
- When creating files, write them directly. Do not explain what you will write before writing it.
- Batch related edits into single operations. Do not edit the same file multiple times in sequence.

## File reading rules
- Read only the files needed for the current task. Do not explore the codebase broadly.
- Never read node_modules/, .next/, dist/, or lock files.
- When asked to modify a specific file, read ONLY that file, not its neighbors.
- If the task names specific files, work only on those files.

## Command output rules
- Pipe long command outputs through `head` or `tail` when full output is not needed.
- Use `--quiet` or `--silent` flags when available (npm install --silent, etc).
- For test runs, use `--reporter=dot` or similar compact output.
- Do not run `cat` on large files. Use `head -50` to preview.

## Context management
- If the conversation is getting long and a subtask is complete, suggest /compact to the user.
- Do not repeat instructions or re-explain architecture already discussed.
- When referencing project architecture, point to docs/architecture.md instead of re-stating it.

## Execution rules
- Plan before executing. State the plan in 1-3 lines, then execute.
- One logical task per session. Suggest /clear between unrelated tasks.
- After completing a task, run verification (typecheck, lint, test) and stop. Do not suggest next steps unless asked.
