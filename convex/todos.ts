import { mutation, query } from "@/convex/_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("todos").collect();
  },
});

export const completedTodos = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();
  },
});

export const inCompleteTodos = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("isCompleted"), false))
      .collect();
  },
});

export const totalTodos = query({
  args: {},
  handler: async (ctx) => {
    const completedTodos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();

    return completedTodos.length || 0;
  },
});

export const checkATodo = mutation({
  args: { todoId: v.id("todos") },
  handler: async (ctx, { todoId }) => {
    const newTodoId = await ctx.db.patch(todoId, {
      isCompleted: true,
    });

    return newTodoId;
  },
});

export const unCheckATodo = mutation({
  args: { todoId: v.id("todos") },
  handler: async (ctx, { todoId }) => {
    const newTodoId = await ctx.db.patch(todoId, {
      isCompleted: false,
    });

    return newTodoId;
  },
});

export const createATodo = mutation({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id("projects"),
    labelId: v.id("labels"),
  },
  handler: async (
    ctx,
    { taskName, description, priority, dueDate, projectId, labelId }
  ) => {
    try {
      const newTodoId = await ctx.db.insert("todos", {
        userId: "jn7c58v9d99e0xa7c64ac0afb16z2zkp" as Id<"users">,
        taskName,
        description,
        priority,
        dueDate,
        projectId,
        labelId,
        isCompleted: false,
      });

      return newTodoId;
    } catch (error) {
      console.log("Error occurred during createATodo mutation");

      return error;
    }
  },
});
