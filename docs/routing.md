# Routing Coding Standards

## Route Structure

**All application routes must live under `/dashboard`.** There are no authenticated feature pages outside of this prefix.

```
/                        — Public landing page
/sign-in                 — Clerk sign-in page
/sign-up                 — Clerk sign-up page
/dashboard               — Main authenticated app entry point
/dashboard/[feature]/... — All feature pages
```

Do NOT create top-level routes for application features (e.g. `/workouts`, `/profile`). Everything goes under `/dashboard`.

## Route Protection

**All `/dashboard` routes are protected.** Unauthenticated users must be redirected to `/sign-in`.

Route protection must be implemented in `middleware.ts` using Clerk's `clerkMiddleware`. Do NOT rely solely on per-page `auth()` checks for dashboard routes — middleware is the enforcement point.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
}
```

Any route not explicitly listed as public is treated as protected by default.

## File Conventions

Pages under `/dashboard` follow Next.js App Router conventions:

```
src/app/dashboard/
  page.tsx                        — /dashboard
  layout.tsx                      — Shared layout for all dashboard pages
  [feature]/
    page.tsx                      — /dashboard/[feature]
    [id]/
      page.tsx                    — /dashboard/[feature]/[id]
      actions.ts                  — Server actions colocated with the page
```

- Each route segment gets its own directory.
- `actions.ts` files are colocated with the page that uses them (see `/docs/data-mutations.md`).
- Do not place server actions in shared/global directories.

## Navigation

Use Next.js `<Link>` for all internal navigation. Do not use `<a>` tags for internal links.

```tsx
import Link from "next/link"

<Link href="/dashboard/workouts">Workouts</Link>
```

## Summary Checklist

- [ ] All authenticated feature routes are nested under `/dashboard`
- [ ] Route protection is enforced via `clerkMiddleware` in `middleware.ts`
- [ ] Public routes are explicitly listed in `createRouteMatcher`
- [ ] Pages follow the App Router file convention under `src/app/dashboard/`
- [ ] Internal navigation uses `<Link>`, not `<a>`
- [ ] `actions.ts` is colocated with the page, not in a global directory
