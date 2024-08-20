"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Text } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CardFooter } from "@/components/ui/card";

const FormSchema = z.object({
  taskName: z.string().min(2, {
    message: "Taskname must be at least 2 characters.",
  }),
  description: z.string().optional(),
  priority: z.string(),
  dueDate: z.date(),
  projectId: z.string(),
  labelId: z.string(),
});

export default function AddTaskInline({
  setShowAddTask,
}: {
  setShowAddTask: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      taskName: "",
      description: "",
      priority: "1",
      dueDate: new Date(),
      projectId: "k97ehx0j897sskm7y684f5zakd6z4yvh",
      labelId: "k57fqf7wh29xrn2dnqrvh1h70s6z4ypg",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {}

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
                      required
                      className="resize-none"
                      {...field}
                    />
                  </div>
                </FormControl>
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
