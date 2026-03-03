import { auth } from "@clerk/nextjs/server";
import { getWorkouts } from "@/data/workouts";
import WorkoutCalendar from "./workout-calendar";

type SearchParams = Promise<{ date?: string }>;

async function DashboardContent({
  selectedDate,
}: {
  selectedDate: Date;
}) {
  const { userId } = await auth();
  if (!userId) return null;

  const workouts = await getWorkouts(userId, selectedDate);

  return <WorkoutCalendar workouts={workouts} selectedDate={selectedDate} />;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { date } = await searchParams;
  const selectedDate = date ? new Date(date) : new Date();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Workout Diary</h1>
      <DashboardContent selectedDate={selectedDate} />
    </div>
  );
}
