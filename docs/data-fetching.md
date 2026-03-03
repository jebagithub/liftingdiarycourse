# Data Fetching

## Golden Rule: Server Components Only

All data fetching in this application **must** be done exclusively via **React Server Components**.

**Never** fetch data via:
- Route handlers (`app/api/` endpoints)
- Client components (`"use client"`)
- `useEffect` + `fetch`
- SWR, React Query, or any client-side data fetching library

If you need data in a client component, fetch it in a server component ancestor and pass it down as props.

## Database Queries via `/data` Helpers

All database queries **must** go through helper functions in the `/data` directory. Do not write inline database queries in page or component files.

```
src/
  data/
    workouts.ts
    exercises.ts
    sets.ts
```

Helper functions must use **Drizzle ORM** to query the database. **Never use raw SQL.**

```ts
// ✅ Correct
import { db } from "@/db"
import { workouts } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId))
}
```

```ts
// ❌ Wrong — raw SQL
export async function getWorkouts(userId: string) {
  return db.execute(sql`SELECT * FROM workouts WHERE user_id = ${userId}`)
}
```

```ts
// ❌ Wrong — query inside a page/component
export default async function WorkoutsPage() {
  const data = await db.select().from(workouts) // do not do this
}
```

## User Data Isolation — Critical

A logged-in user must **only ever be able to access their own data**. This is a hard security requirement.

Every data helper function that returns user-owned data **must** filter by the authenticated user's ID. Never trust a user-supplied ID from params or request body alone — always resolve the current user from the session and use that ID.

```ts
// ✅ Correct — session userId used to scope the query
export async function getWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId))
}

// In the server component:
const session = await auth()
const data = await getWorkouts(session.user.id) // session-derived, not from params
```

```ts
// ❌ Wrong — trusting a caller-supplied or URL-derived ID without auth check
export async function getWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId))
}

// In the server component:
const { userId } = params // never use this as the userId for data fetching
const data = await getWorkouts(userId)
```

When fetching a single record by ID (e.g. a specific workout), always include a `userId` condition to prevent users from accessing records that belong to others:

```ts
// ✅ Correct — scoped to both record ID and owner
export async function getWorkout(id: string, userId: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
  return workout ?? null
}
```

```ts
// ❌ Wrong — fetches by ID alone, any user could access any record
export async function getWorkout(id: string) {
  const [workout] = await db.select().from(workouts).where(eq(workouts.id, id))
  return workout
}
```

## Summary Checklist

- [ ] Data is fetched in a server component
- [ ] No `fetch`/`useEffect` or client-side data libraries used
- [ ] Query is in a `/data` helper function
- [ ] Helper uses Drizzle ORM (no raw SQL)
- [ ] Query is scoped to the authenticated user's session ID
- [ ] Single-record lookups include both the record ID and the user ID filter
