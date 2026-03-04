import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkout } from "@/data/workouts";
import EditWorkoutForm from "./edit-workout-form";

interface EditWorkoutPageProps {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { workoutId } = await params;
  const id = Number(workoutId);
  if (isNaN(id)) notFound();

  const workout = await getWorkout(id, userId);
  if (!workout) notFound();

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Edit Workout</h1>
      <EditWorkoutForm
        workoutId={workout.id}
        defaultValues={{
          name: workout.name,
          notes: workout.notes ?? "",
        }}
      />
    </div>
  );
}
