---
mode: agent
description: Run ESLint on the whole project and automatically fix every linting issue found.
---

Your task is to lint the entire codebase and leave it clean. Follow these steps:

1. Run `npm run lint` and capture the full output.
2. Run `npm run lint:fix` to auto-fix everything ESLint can resolve.
3. For any errors that ESLint could **not** auto-fix, read the relevant files and apply manual fixes that satisfy AirBnb style rules.
4. Re-run `npm run lint` to confirm **zero errors** remain.

Report a concise summary of every change made, grouped by file.
