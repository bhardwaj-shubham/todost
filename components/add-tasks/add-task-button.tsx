import React, { useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";

import AddTaskInline from "./add-task-inline";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AddTaskWrapper = ({
  parentTask,
  projectId,
}: {
  parentTask?: Doc<"todos">;
  projectId?: Id<"projects">;
}) => {
  const [showAddTask, setShowAddTask] = useState(false);

  return showAddTask ? (
    <AddTaskInline
      setShowAddTask={setShowAddTask}
      parentTask={parentTask}
      projectId={projectId}
    />
  ) : (
    <AddTaskButton
      onClick={() => setShowAddTask(true)}
      title={parentTask?._id ? "Add sub-task" : "Add task"}
    />
  );
};

export default function AddTaskButton({
  onClick,
  title,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title: string;
}) {
  return (
    <Button
      variant={"ghost"}
      className="pl-2 flex mt-2 flex-1"
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center text-center gap-1">
        <div className="flex items-center justify-center gap-2">
          <Plus className="h-4 w-4 text-primary hover:bg-primary hover:rounded-xl hover:text-white" />
          <h3 className="text-base font-light tracking-tight text-foreground/70">
            {title}
          </h3>
        </div>
      </div>
    </Button>
  );
}
