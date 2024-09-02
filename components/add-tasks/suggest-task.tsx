import { useState } from "react";

import { Id } from "@/convex/_generated/dataModel";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Heart, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuggestMissingTasks({
  projectId,
}: {
  projectId: Id<"projects">;
}) {
  const [isLoadingSuggestMissingTasks, setIsLoadingSuggestMissingTasks] =
    useState(false);

  const suggestMissingTasks = useAction(api.suggestTasks.generateContent) || [];

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

  return (
    <>
      <Button
        variant={"outline"}
        disabled={isLoadingSuggestMissingTasks}
        onClick={handleMissingTasks}
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
