"use client";

import moment from "moment";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { AddTaskWrapper } from "../add-tasks/add-task-button";
import Todos from "../todos/todos";

import { Dot } from "lucide-react";

export default function UpcomingPage() {
  const overDueTodos = useQuery(api.todos.overDueTodos) ?? [];
  const groupTodosByDate = useQuery(api.todos.groupTodosByDate) ?? [];

  if (overDueTodos === undefined || groupTodosByDate === undefined) {
    <p>Loading...</p>;
  }

  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Upcoming</h1>
      </div>

      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm">Overdue</p>
        <Todos items={overDueTodos} />
      </div>

      <div className="pb-6">
        <AddTaskWrapper />
      </div>

      <div className="flex flex-col gap-1 py-4">
        {Object.keys(groupTodosByDate || {}).map((dueDate) => (
          <div key={dueDate} className="mb-6">
            <p className="font-bold flex text-sm items-center border-b-2 p-2 border-gray-100">
              {moment(dueDate).format("LL")}
              <Dot />
              {moment(dueDate).format("dddd")}
            </p>
            <ul>
              <Todos items={groupTodosByDate[dueDate]} />
              <AddTaskWrapper />
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
