# UI Coding Standards

## Component Library

**ONLY shadcn/ui components may be used for UI in this project.**

- Do NOT create custom components
- Do NOT use any other component library (MUI, Chakra, Ant Design, etc.)
- Do NOT write raw HTML elements styled with Tailwind as standalone components
- All UI must be composed exclusively from shadcn/ui components

Install new shadcn/ui components as needed:

```bash
npx shadcn@latest add <component-name>
```

Browse available components at https://ui.shadcn.com/docs/components

## Date Formatting

Use `date-fns` for all date formatting. Do NOT use `toLocaleDateString`, `Intl.DateTimeFormat`, or manual string manipulation.

### Required Format

Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### Implementation

Use `format` from `date-fns` with the `do MMM yyyy` format token:

```ts
import { format } from "date-fns";

format(new Date("2025-09-01"), "do MMM yyyy"); // "1st Sep 2025"
format(new Date("2025-08-02"), "do MMM yyyy"); // "2nd Aug 2025"
format(new Date("2026-01-03"), "do MMM yyyy"); // "3rd Jan 2026"
format(new Date("2024-06-04"), "do MMM yyyy"); // "4th Jun 2024"
```

Install date-fns if not already present:

```bash
npm install date-fns
```
