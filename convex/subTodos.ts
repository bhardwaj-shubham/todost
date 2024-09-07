import { action, mutation, query } from "@/convex/_generated/server";
import { v } from "convex/values";
import { handleUserId } from "./auth";
import { createEmbeddingWithAI } from "./taskSuggestionService";
import { api } from "./_generated/api";

export const getSubTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();
    }

    return [];
  },
});

export const getSubTodosByParentId = query({
  args: {
    parentId: v.id("todos"),
  },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("parentId"), parentId))
        .collect();
    }

    return [];
  },
});

export const completedSubTodos = query({
  args: {
    parentId: v.id("todos"),
  },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("parentId"), parentId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .collect();
    }

    return [];
  },
});

export const inCompleteSubTodos = query({
  args: { parentId: v.id("todos") },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("parentId"), parentId))
        .filter((q) => q.eq(q.field("isCompleted"), false))
        .collect();
    }

    return [];
  },
});

export const checkASubTodo = mutation({
  args: { todoId: v.id("subTodos") },
  handler: async (ctx, { todoId }) => {
    const newTodoId = await ctx.db.patch(todoId, {
      isCompleted: true,
    });

    return newTodoId;
  },
});

export const unCheckASubTodo = mutation({
  args: { todoId: v.id("subTodos") },
  handler: async (ctx, { todoId }) => {
    const newTodoId = await ctx.db.patch(todoId, {
      isCompleted: false,
    });

    return newTodoId;
  },
});

export const createASubTodo = mutation({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id("projects"),
    labelId: v.id("labels"),
    parentId: v.id("todos"),
    embedding: v.optional(v.array(v.float64())),
  },
  handler: async (
    ctx,
    {
      taskName,
      description,
      priority,
      dueDate,
      projectId,
      labelId,
      parentId,
      embedding,
    }
  ) => {
    try {
      const userId = await handleUserId(ctx);

      if (userId) {
        const newSubTodoId = await ctx.db.insert("subTodos", {
          userId,
          taskName,
          description,
          priority,
          dueDate,
          projectId,
          labelId,
          isCompleted: false,
          parentId,
          embedding,
        });

        return newSubTodoId;
      }

      return null;
    } catch (error) {
      console.log("Error occurred during createASubTodo mutation");

      return null;
    }
  },
});

export const createTodoAndEmbeddings = action({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id("projects"),
    parentId: v.id("todos"),
    labelId: v.id("labels"),
  },
  handler: async (
    ctx,
    { taskName, description, priority, dueDate, projectId, labelId, parentId }
  ) => {
    const embedding = await createEmbeddingWithAI(taskName);

    await ctx.runMutation(api.subTodos.createASubTodo, {
      taskName,
      description,
      priority,
      dueDate,
      projectId,
      labelId,
      parentId,
      embedding,
    });
  },
});
