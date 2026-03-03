"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Workout = {
  id: number;
  name: string;
  createdAt: Date;
};

export default function WorkoutCalendar({
  workouts,
  selectedDate,
}: {
  workouts: Workout[];
  selectedDate: Date;
}) {
  const router = useRouter();

  function handleSelect(d: Date | undefined) {
    if (!d) return;
    const formatted = format(d, "yyyy-MM-dd");
    router.push(`/dashboard?date=${formatted}`);
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
        />
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">
          Workouts for {format(selectedDate, "do MMM yyyy")}
        </h2>

        <div className="flex flex-col gap-3">
          {workouts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No workouts logged for this day.
            </p>
          ) : (
            workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(workout.createdAt), "do MMM yyyy")}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
