"use client";

import moment from "moment";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { AddTaskWrapper } from "../add-tasks/add-task-button";
import Todos from "../todos/todos";

import { Dot } from "lucide-react";

export default function TodayTodos() {
  const overDueTodos = useQuery(api.todos.overDueTodos) ?? [];
  const todayTodos = useQuery(api.todos.getTodayTodos) ?? [];

  if (overDueTodos === undefined || todayTodos === undefined) {
    <p>Loading...</p>;
  }

  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Today</h1>
      </div>

      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm">Overdue</p>
        <Todos items={overDueTodos} />
      </div>

      <AddTaskWrapper />

      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm items-center border-b-2 p-2 border-gray-100">
          {moment(new Date()).format("LL")}
          <Dot />
          {moment(new Date()).format("dddd")}
        </p>
        <Todos items={todayTodos} />
      </div>
    </div>
  );
}
