"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { CalendarIcon, Text } from "lucide-react";
import moment from "moment";
import { useToast } from "../ui/use-toast";

const FormSchema = z.object({
  taskName: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
  description: z.string().optional().default(""),
  priority: z.string().min(1, { message: "Please select a prority" }),
  dueDate: z.date({ required_error: "A due date is required" }),
  projectId: z.string().min(1, { message: "Please select a project" }),
  labelId: z.string().min(1, { message: "Please select a project" }),
});

export default function AddTaskInline({
  setShowAddTask,
  parentTask,
  projectId: userProjectId,
}: {
  setShowAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  parentTask: Doc<"todos">;
  projectId?: Id<"projects">;
}) {
  const projectId =
    userProjectId ||
    parentTask?.projectId ||
    (process.env.Default_ProjectID as Id<"projects">);

  const labelId =
    parentTask?.labelId || (process.env.Default_LabelID as Id<"labels">);

  const priority = parentTask?.priority?.toString() || "1";
  const parentId = parentTask?._id;

  const projects = useQuery(api.projects.getProjects) ?? [];
  const labels = useQuery(api.labels.getLabels) ?? [];

  const createATodoMutation = useAction(api.todos.createTodoAndEmbeddings);
  const createASubTodoMutation = useAction(
    api.subTodos.createTodoAndEmbeddings
  );

  const { toast } = useToast();

  const defaultValues = {
    taskName: "",
    description: "",
    priority,
    dueDate: new Date(),
    projectId,
    labelId,
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { taskName, description, priority, dueDate, projectId, labelId } =
      data;

    if (parentId) {
      const mutationId = createASubTodoMutation({
        taskName,
        description,
        priority: parseInt(priority),
        dueDate: moment(dueDate).valueOf(),
        projectId: projectId as Id<"projects">,
        labelId: labelId as Id<"labels">,
        parentId,
      });

      if (mutationId !== undefined) {
        toast({ title: "Successfully created a sub-todo.", duration: 3000 });

        form.reset({ ...defaultValues });
      }

      setShowAddTask(false);
    } else {
      const mutationId = createATodoMutation({
        taskName,
        description,
        priority: parseInt(priority),
        dueDate: moment(dueDate).valueOf(),
        projectId: projectId as Id<"projects">,
        labelId: labelId as Id<"labels">,
      });

      if (mutationId !== undefined) {
        toast({ title: "Successfully created a todo.", duration: 3000 });

        form.reset({ ...defaultValues });
      }

      setShowAddTask(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 border-2 p-2 border-gray-200 my-2 rounded-xl px-3 pt-4 border-foreground/20"
        >
          <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="taskName"
                    type="text"
                    placeholder="Enter your task"
                    required
                    className="border-0 font-semibold text-lg"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-start gap-2">
                    <Text className="ml-auto h-4 w-4 opacity-50" />
                    <Textarea
                      id="description"
                      placeholder="Description"
                      className="resize-none"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "flex gap-2 w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={priority}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Priority 1</SelectItem>
                      <SelectItem value="2">Priority 2</SelectItem>
                      <SelectItem value="3">Priority 3</SelectItem>
                      <SelectItem value="4">Priority 4</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="labelId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={labelId || field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a label" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {labels.map((label: Doc<"labels">, index: number) => (
                        <SelectItem key={index} value={label._id}>
                          {label?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={projectId || field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map((project: Doc<"projects">, index: number) => (
                      <SelectItem key={index} value={project?._id}>
                        {project?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <CardFooter className="flex flex-col lg:flex-row lg:justify-between gap-2 border-t-2 pt-3">
            <div className="w-full lg:w-1/4"></div>
            <div className="flex gap-3 self-end">
              <Button
                variant={"outline"}
                className="px-6 bg-gray-300/40 text-gray-950 hover:bg-gray-300"
                onClick={() => setShowAddTask(false)}
              >
                Cancel
              </Button>
              <Button className="px-6" type="submit">
                Add Task
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
