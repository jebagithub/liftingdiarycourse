import { db } from "@/db";
import { workouts } from "@/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

export async function getWorkouts(userId: string, date?: Date) {
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return db
      .select()
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, userId),
          gte(workouts.createdAt, start),
          lt(workouts.createdAt, end)
        )
      );
  }

  return db.select().from(workouts).where(eq(workouts.userId, userId));
}

export async function createWorkout(
  userId: string,
  name: string,
  notes: string | null
) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, name, notes })
    .returning();
  return workout;
}
