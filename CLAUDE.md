# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 16 app using the App Router with TypeScript and Tailwind CSS v4.

- `src/app/` — App Router pages and layouts
  - `layout.tsx` — Root layout (wraps all pages)
  - `page.tsx` — Home page (`/`)
  - `globals.css` — Global styles with Tailwind directives

The project is a fresh scaffold (course starter template) intended to be built out into a lifting/workout diary application.
