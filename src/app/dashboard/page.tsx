"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MOCK_WORKOUTS = [
  { id: 1, name: "Squat", sets: 4, reps: 5, weight: 100 },
  { id: 2, name: "Bench Press", sets: 3, reps: 8, weight: 80 },
  { id: 3, name: "Deadlift", sets: 1, reps: 5, weight: 140 },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Workout Diary</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
          />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>

          <div className="flex flex-col gap-3">
            {MOCK_WORKOUTS.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {workout.sets} sets &times; {workout.reps} reps &mdash;{" "}
                    {workout.weight}kg
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
