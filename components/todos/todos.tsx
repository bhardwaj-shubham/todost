import { Doc } from "@/convex/_generated/dataModel";

import Task from "./task";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";

export default function Todos({ items }: { items: Array<Doc<"todos">> }) {
  const { toast } = useToast();

  const checkATodo = useMutation(api.todos.checkATodo);
  const unCheckATodo = useMutation(api.todos.unCheckATodo);

  const handleOnChange = (task: Doc<"todos">) => {
    if (task.isCompleted) {
      unCheckATodo({ todoId: task._id });
    } else {
      toast({
        title: "Task Completed",
        description: "You're rockstar",
        duration: 3000,
      });

      checkATodo({ todoId: task._id });
    }
  };

  return items.map((task: Doc<"todos">) => (
    <Task
      key={task._id}
      data={task}
      isCompleted={task.isCompleted}
      handleOnChange={() => handleOnChange(task)}
    />
  ));
}
