import { useEffect, useState } from "react";
import { format } from "date-fns";

import { useMutation, useQuery } from "convex/react";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import Task from "../todos/task";
import { AddTaskWrapper } from "./add-task-button";

import { Calendar, ChevronDown, Flag, Hash, Tag } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AddTaskDialog({ data }: { data: Doc<"todos"> }) {
  const { taskName, description, projectId, labelId, priority, dueDate, _id } =
    data;

  const project = useQuery(api.projects.getProjectById, {
    projectId,
  });

  const label = useQuery(api.labels.getLabelById, {
    labelId,
  });

  const inCompleteSubTodosByProject =
    useQuery(api.subTodos.inCompleteSubTodos, {
      parentId: _id,
    }) ?? [];

  const completedSubTodosByProject =
    useQuery(api.subTodos.completedSubTodos, {
      parentId: _id,
    }) ?? [];

  const checkASubTodoMutation = useMutation(api.subTodos.checkASubTodo);
  const unCheckASubTodoMutation = useMutation(api.subTodos.unCheckASubTodo);

  const [todoDetails, setTodoDetails] = useState<
    { labelName: string; value: string | undefined; icon: JSX.Element }[]
  >([]);

  useEffect(() => {
    const todoData = [
      {
        labelName: "Project",
        value: project?.name,
        icon: <Hash className="w-4 h-4 text-primary capitalize" />,
      },
      {
        labelName: "Due Date",
        value: format(dueDate || new Date(), "MM dd yyyy"),
        icon: <Calendar className="w-4 h-4 text-primary capitalize" />,
      },
      {
        labelName: "Priority",
        value: priority?.toString() || "",
        icon: <Flag className="w-4 h-4 text-primary capitalize" />,
      },
      {
        labelName: "Label",
        value: label?.name || "",
        icon: <Tag className="w-4 h-4 text-primary capitalize" />,
      },
    ];

    if (todoData) {
      setTodoDetails(todoData);
    }
  }, [dueDate, label?.name, priority, project?.name]);

  return (
    <DialogContent className="max-w-4xl lg:h-4/6 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader className="w-full">
        <DialogTitle>{taskName}</DialogTitle>
        <DialogDescription>
          <p className="my-2 capitalize">{description}</p>
          <div className="flex items-center gap-1 mt-12 border-b-2 border-gray-100 pb-2 flex-wrap sm:justify-between lg:gap-0">
            <div className="flex gap-1">
              <ChevronDown className="w-5 h-5 text-primary" />
              <p className="font-bold flex text-sm text-gray-900">Sub-tasks</p>
            </div>
            <div>
              <Button variant={"outline"}>Suggest Missing Task (AI)</Button>
            </div>
          </div>
          <div className="pl-4">
            {inCompleteSubTodosByProject.map((task) => (
              <Task
                key={task._id}
                data={task}
                isCompleted={task.isCompleted}
                handleOnChange={() =>
                  checkASubTodoMutation({ todoId: task._id })
                }
              />
            ))}

            <div className="pb-4">
              <AddTaskWrapper parentTask={data} />
            </div>

            {completedSubTodosByProject.map((task) => (
              <Task
                key={task._id}
                data={task}
                isCompleted={task.isCompleted}
                handleOnChange={() =>
                  unCheckASubTodoMutation({ todoId: task._id })
                }
              />
            ))}
          </div>
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2 bg-gray-100 lg:w-1/2">
        {todoDetails.map(({ labelName, value, icon }, index) => (
          <div key={index} className="grid gap-2 p-4 border-b-2 w-full">
            <Label className="flex items-start">{labelName}</Label>
            <div className="flex text-left items-center justify-start gap-2 pb-2">
              {icon}
              <p className="text-sm">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </DialogContent>
  );
}
