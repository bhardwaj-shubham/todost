import { action, mutation, query } from "@/convex/_generated/server";
import { v } from "convex/values";
import moment from "moment";
import { api } from "./_generated/api";
import { handleUserId } from "./auth";
import { createEmbeddingWithAI } from "./taskSuggestionService";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();
    }

    return [];
  },
});

export const getCompletedTodosByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("projectId"), projectId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .collect();
    }
    return [];
  },
});

export const getInCompletedTodosByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("projectId"), projectId))
        .filter((q) => q.eq(q.field("isCompleted"), false))
        .collect();
    }
    return [];
  },
});

export const getTodosByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("projectId"), projectId))
        .collect();
    }
    return [];
  },
});

export const getTodosTotalByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const todos = await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("projectId"), projectId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .collect();

      return todos?.length || 0;
    }
    return 0;
  },
});

export const getTodayTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const todayStart = moment().startOf("day");
      const todayEnd = moment().endOf("day");

      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter(
          (q) =>
            q.gte(q.field("dueDate"), todayStart.valueOf()) &&
            q.lte(q.field("dueDate"), todayEnd.valueOf())
        )
        .collect();
    }

    return [];
  },
});

export const overDueTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.lt(q.field("dueDate"), todayStart.getTime()))
        .collect();
    }

    return [];
  },
});

export const completedTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .collect();
    }

    return [];
  },
});

export const inCompleteTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("isCompleted"), false))
        .collect();
    }

    return [];
  },
});

export const totalTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const completedTodos = await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .collect();

      return completedTodos.length || 0;
    }
    return 0;
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
    embedding: v.optional(v.array(v.float64())),
  },
  handler: async (
    ctx,
    { taskName, description, priority, dueDate, projectId, labelId, embedding }
  ) => {
    try {
      const userId = await handleUserId(ctx);

      if (userId) {
        const newTodoId = await ctx.db.insert("todos", {
          userId,
          taskName,
          description,
          priority,
          dueDate,
          projectId,
          labelId,
          isCompleted: false,
          embedding,
        });

        return newTodoId;
      }

      return null;
    } catch (error) {
      console.log("Error occurred during createATodo mutation");

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
    labelId: v.id("labels"),
  },
  handler: async (
    ctx,
    { taskName, description, priority, dueDate, projectId, labelId }
  ) => {
    const embedding = await createEmbeddingWithAI(taskName);

    await ctx.runMutation(api.todos.createATodo, {
      taskName,
      description,
      priority,
      dueDate,
      projectId,
      labelId,
      embedding,
    });
  },
});

export const groupTodosByDate = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const upcomingTodos = await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.gt(q.field("dueDate"), new Date().getTime()))
        .filter((q) => q.gt(q.field("isCompleted"), false))
        .collect();

      const groupedTodos = upcomingTodos.reduce<any>((acc, todo) => {
        const dueDate = new Date(todo.dueDate).toDateString();

        acc[dueDate] = (acc[dueDate] || []).concat(todo);

        return acc;
      }, {});

      return groupedTodos;
    }

    return [];
  },
});

export const deleteTodo = mutation({
  args: {
    todoId: v.id("todos"),
  },
  handler: async (ctx, { todoId }) => {
    try {
      const userId = await handleUserId(ctx);

      if (userId) {
        const deletedTodoId = await ctx.db.delete(todoId);

        console.log("Todo deleted with id:", deletedTodoId);
      }
    } catch (error) {
      console.log("Error occurred during deleteTodo mutation");

      return null;
    }
  },
});
