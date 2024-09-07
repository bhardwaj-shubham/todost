import { useState } from "react";

import { Id } from "@/convex/_generated/dataModel";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuggestMissingTasks({
  projectId,
  isSubTask = false,
  taskName = "",
  description = "",
  parentId,
}: {
  projectId: Id<"projects">;
  isSubTask?: boolean;
  taskName?: string;
  description?: string;
  parentId?: Id<"todos">;
}) {
  const [isLoadingSuggestMissingTasks, setIsLoadingSuggestMissingTasks] =
    useState(false);

  const suggestMissingTasks = useAction(
    api.taskSuggestionService.suggestMissingTask
  );

  const handleMissingTasks = async () => {
    setIsLoadingSuggestMissingTasks(true);

    try {
      await suggestMissingTasks({ projectId: projectId[0] as Id<"projects"> });
    } catch (error) {
      console.log("Error in suggestingMissingTasks", error);
    } finally {
      setIsLoadingSuggestMissingTasks(false);
    }
  };

  const suggestMissingSubTasks = useAction(
    api.taskSuggestionService.suggestMissingSubTask
  );

  const handleMissingSubTasks = async () => {
    setIsLoadingSuggestMissingTasks(true);

    try {
      await suggestMissingSubTasks({
        projectId,
        taskName,
        description,
        parentId: parentId!,
      });
    } catch (error) {
      console.log("Error in suggestingMissingTasks", error);
    } finally {
      setIsLoadingSuggestMissingTasks(false);
    }
  };

  return (
    <>
      <Button
        variant={"outline"}
        disabled={isLoadingSuggestMissingTasks}
        onClick={isSubTask ? handleMissingSubTasks : handleMissingTasks}
      >
        {isLoadingSuggestMissingTasks ? (
          <div className="flex gap-2">
            Loading Tasks (AI)
            <LoaderCircle className="h-5 w-5 text-primary animate-spin" />
          </div>
        ) : (
          <div className="flex gap-2">
            Suggest Missing Tasks (AI)
            <span>💖</span>
          </div>
        )}
      </Button>
    </>
  );
}
