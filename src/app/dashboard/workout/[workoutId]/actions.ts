"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  notes: z.string().max(1000).optional(),
});

export async function updateWorkoutAction(
  workoutId: number,
  name: string,
  notes?: string
) {
  const { name: validatedName, notes: validatedNotes } =
    updateWorkoutSchema.parse({ name, notes });

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await updateWorkout(workoutId, userId, validatedName, validatedNotes ?? null);
  redirect("/dashboard");
}
