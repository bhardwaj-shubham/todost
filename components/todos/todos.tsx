import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import Task from "./task";
import { useToast } from "@/components/ui/use-toast";

export default function Todos({
  items,
  showDetails = false,
}: {
  items: Array<Doc<"todos">>;
  showDetails?: boolean;
}) {
  const { toast } = useToast();

  const checkATodo = useMutation(api.todos.checkATodo);
  const unCheckATodo = useMutation(api.todos.unCheckATodo);

  const handleOnChange = (task: Doc<"todos">) => {
    if (task.isCompleted) {
      unCheckATodo({ todoId: task._id });
    } else {
      checkATodo({ todoId: task._id });

      toast({
        title: "Task Completed",
        description: "You're rockstar",
        duration: 3000,
      });
    }
  };

  return items.map((task: Doc<"todos">) => (
    <Task
      key={task._id}
      data={task}
      isCompleted={task.isCompleted}
      handleOnChange={() => handleOnChange(task)}
      showDetails={showDetails}
    />
  ));
}
