"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  notes: z.string().max(1000).optional(),
});

export async function createWorkoutAction(name: string, notes?: string) {
  const { name: validatedName, notes: validatedNotes } =
    createWorkoutSchema.parse({ name, notes });

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const workout = await createWorkout(userId, validatedName, validatedNotes ?? null);
  redirect(`/dashboard`);
}
