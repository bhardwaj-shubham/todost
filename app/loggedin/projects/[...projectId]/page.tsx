"use client";

import { useParams } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

import Todos from "@/components/todos/todos";

import MobileNav from "@/components/nav-bar/mobile-nav";
import SideBar from "@/components/nav-bar/side-bar";
import { AddTaskWrapper } from "@/components/add-tasks/add-task-button";
import CompletedTodos from "@/components/todos/completed-todos";
import SuggestMissingTasks from "@/components/add-tasks/suggest-task";
import DeleteProject from "@/components/projects/delete-project";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: Id<"projects"> }>();

  const inCompletedTodosByProjectId =
    useQuery(api.todos.getInCompletedTodosByProjectId, {
      projectId,
    }) ?? [];

  const completedTodosByProjectId =
    useQuery(api.todos.getCompletedTodosByProjectId, {
      projectId,
    }) ?? [];

  const totalTodosByProjectId =
    useQuery(api.todos.getTodosTotalByProjectId, {
      projectId,
    }) || 0;

  const project = useQuery(api.projects.getProjectById, {
    projectId,
  });

  const projectName = project?.name ?? "Get Started";

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />

      <div className="flex flex-col">
        <MobileNav navTitle={"My Projects"} navLink={"/loggedin/projects"} />

        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-2 lg:gap-0">
            <h1 className="text-lg font-semibold md:text-2xl">
              {projectName || "Project"}
            </h1>
            <div className="flex gap-2 lg:gap-12 mx-2 items-center">
              <SuggestMissingTasks projectId={projectId} />
              <DeleteProject projectId={projectId} />
            </div>
          </div>

          <Todos items={inCompletedTodosByProjectId} />

          <div className="pb-6">
            <AddTaskWrapper projectId={projectId} />
          </div>

          <Todos items={completedTodosByProjectId} />

          <div className="flex items-center space-x-4 gap-2 border-b-2 p-2 border-gray-100 text-sm text-foreground/80">
            <CompletedTodos totalTodos={totalTodosByProjectId} />
          </div>
        </main>
      </div>
    </div>
  );
}
