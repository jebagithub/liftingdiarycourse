import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NewWorkoutForm from "./new-workout-form";

export default async function NewWorkoutPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">New Workout</h1>
      <NewWorkoutForm />
    </div>
  );
}
