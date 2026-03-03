# Auth Coding Standards

## Provider

**This app uses Clerk for all authentication.** Do NOT use NextAuth, Auth.js, Supabase Auth, or any other auth library.

## Getting the Current User

Use Clerk's `auth()` helper from `@clerk/nextjs/server` to get the current user's ID in server components and data helpers.

```ts
import { auth } from "@clerk/nextjs/server"

const { userId } = await auth()
```

Never source `userId` from URL params, request bodies, or any client-supplied value. Always derive it from the Clerk session.

## Protecting Pages

Use Clerk's `auth()` in server components to guard authenticated pages. Redirect unauthenticated users to the sign-in page.

```ts
// ✅ Correct — redirects if not signed in
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  // ...
}
```

```ts
// ❌ Wrong — no auth check, page is accessible to anyone
export default async function ProtectedPage() {
  const data = await getSomeUserData()
  // ...
}
```

Alternatively, use Clerk middleware (`clerkMiddleware`) in `middleware.ts` to protect entire route groups rather than checking in every page individually.

## Middleware

Route protection via middleware must use `clerkMiddleware` from `@clerk/nextjs/server`.

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

## UI Components

Use Clerk's pre-built components for sign-in, sign-up, and user profile UI. Do NOT build custom auth forms.

```tsx
import { SignIn } from "@clerk/nextjs"
import { SignUp } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"
import { SignedIn, SignedOut } from "@clerk/nextjs"
```

Place `<UserButton />` in the app header for the authenticated user menu. Use `<SignedIn>` / `<SignedOut>` wrappers to conditionally render content based on auth state.

## Passing userId to Data Helpers

Always resolve `userId` from Clerk's `auth()` in the server component and pass it explicitly to data helper functions. Never pass user identity through props from client components.

```ts
// ✅ Correct — userId comes from the session
import { auth } from "@clerk/nextjs/server"
import { getWorkouts } from "@/data/workouts"

export default async function WorkoutsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const workouts = await getWorkouts(userId)
  // ...
}
```

## Summary Checklist

- [ ] Clerk is the only auth library used
- [ ] `userId` is always sourced from `auth()`, never from params or client input
- [ ] Authenticated pages redirect unauthenticated users to `/sign-in`
- [ ] Middleware uses `clerkMiddleware` to protect private routes
- [ ] Clerk pre-built components are used for sign-in, sign-up, and user profile UI
- [ ] `userId` is passed from server component to data helpers, not sourced in helpers independently
