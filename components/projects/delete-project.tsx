"use client";

import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { EllipsisIcon, Trash2Icon } from "lucide-react";
import { Starter_ProjectID } from "@/utils";

export default function DeleteProject({
  projectId,
}: {
  projectId: Id<"projects">;
}) {
  const form = useForm();
  const { toast } = useToast();
  const router = useRouter();

  const deleteProject = useAction(api.projects.deleteProject);

  const defaultProjectId = Starter_ProjectID as Id<"projects">;

  if (defaultProjectId === undefined) {
    throw new Error("Default_ProjectID not found");
  }

  console.log("starter project", process.env.NEXT_Default_ProjectID);

  const onSubmit = async () => {
    if (projectId === defaultProjectId) {
      toast({
        title: "System project are protected from deletion",
        duration: 3000,
      });
    } else {
      const deletedProjectId = await deleteProject({ projectId });

      if (deletedProjectId !== undefined) {
        toast({
          title: "Successfully deleted project",
          duration: 3000,
        });

        router.push("/loggedin/projects");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisIcon className="h-5 w-5 text-foreground hover:cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="w-20 lg:w-40">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <button type="submit" className="flex gap-2">
              <Trash2Icon className="h-5 w-5 text-foreground/40" /> Delete
              Project
            </button>
          </form>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
