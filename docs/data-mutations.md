# Data Mutations

## Golden Rule: Server Actions Only

All data mutations in this application **must** be done exclusively via **Next.js Server Actions**.

**Never** mutate data via:
- Route handlers (`app/api/` endpoints)
- Client-side `fetch` calls to external endpoints
- Direct database calls from components or pages

## Server Action File Conventions

Server actions **must** live in colocated `actions.ts` files, placed alongside the page or feature they belong to.

```
src/app/
  workouts/
    page.tsx
    actions.ts        ← server actions for the workouts feature
    [id]/
      page.tsx
      actions.ts      ← server actions for the individual workout feature
```

Every `actions.ts` file **must** have `"use server"` at the top of the file.

```ts
"use server"

// server actions go here
```

## Database Mutations via `/data` Helpers

All database writes **must** go through helper functions in the `src/data/` directory. Do not write inline `db` calls inside server actions or components.

```
src/
  data/
    workouts.ts
    exercises.ts
    sets.ts
```

Helper functions must use **Drizzle ORM**. **Never use raw SQL.**

```ts
// ✅ Correct — mutation helper in src/data/workouts.ts
import { db } from "@/db"
import { workouts } from "@/db/schema"

export async function createWorkout(userId: string, name: string, date: Date) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, name, date })
    .returning()
  return workout
}
```

```ts
// ❌ Wrong — raw SQL
export async function createWorkout(userId: string, name: string) {
  return db.execute(sql`INSERT INTO workouts (user_id, name) VALUES (${userId}, ${name})`)
}
```

```ts
// ❌ Wrong — db call inline inside a server action
"use server"

export async function createWorkoutAction(name: string) {
  await db.insert(workouts).values({ name }) // do not do this
}
```

## Typed Parameters — No FormData

Server action parameters **must** be explicitly typed. **Never** use `FormData` as a parameter type.

```ts
// ✅ Correct — typed params
export async function createWorkoutAction(name: string, date: Date) { ... }

export async function updateWorkoutAction(id: string, data: { name: string; date: Date }) { ... }
```

```ts
// ❌ Wrong — FormData param
export async function createWorkoutAction(formData: FormData) { ... }
```

## Validation with Zod

Every server action **must** validate its arguments with **Zod** before doing anything else. Never trust caller-supplied data.

```ts
"use server"

import { z } from "zod"
import { auth } from "@/auth"
import { createWorkout } from "@/data/workouts"

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.coerce.date(),
})

export async function createWorkoutAction(name: string, date: Date) {
  const { name: validatedName, date: validatedDate } = createWorkoutSchema.parse({ name, date })

  const session = await auth()
  await createWorkout(session.user.id, validatedName, validatedDate)
}
```

```ts
// ❌ Wrong — no validation
export async function createWorkoutAction(name: string, date: Date) {
  const session = await auth()
  await createWorkout(session.user.id, name, date) // trusting raw input
}
```

Define the Zod schema at the top of the file, above the action function. Use `.parse()` (throws on invalid input) rather than `.safeParse()` unless you need to handle errors gracefully and return them to the caller.

## User Data Isolation — Critical

Server actions that create or modify user-owned data **must** resolve the current user from the session. Never accept a `userId` as a parameter — always derive it server-side.

```ts
// ✅ Correct — userId comes from the session
export async function createWorkoutAction(name: string, date: Date) {
  const parsed = createWorkoutSchema.parse({ name, date })
  const session = await auth()
  await createWorkout(session.user.id, parsed.name, parsed.date)
}
```

```ts
// ❌ Wrong — userId accepted as a param (caller can spoof it)
export async function createWorkoutAction(userId: string, name: string, date: Date) {
  await createWorkout(userId, name, date)
}
```

For mutations on a specific record (update, delete), the `/data` helper **must** scope the operation to the authenticated user's ID to prevent one user from modifying another's data:

```ts
// ✅ Correct — scoped to both record ID and owner in the data helper
export async function deleteWorkout(id: string, userId: string) {
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
}
```

```ts
// ❌ Wrong — deletes by ID alone, any user could delete any record
export async function deleteWorkout(id: string) {
  await db.delete(workouts).where(eq(workouts.id, id))
}
```

## Summary Checklist

- [ ] Mutation is in a server action inside a colocated `actions.ts` file
- [ ] `actions.ts` has `"use server"` at the top
- [ ] Server action parameters are explicitly typed — no `FormData`
- [ ] Arguments are validated with Zod before any db call
- [ ] The `db` call is delegated to a helper in `src/data/`
- [ ] Helper uses Drizzle ORM (no raw SQL)
- [ ] `userId` is derived from the session, never accepted as a parameter
- [ ] Record-scoped mutations (update/delete) filter by both record ID and `userId`
