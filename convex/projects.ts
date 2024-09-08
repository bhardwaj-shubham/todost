import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { handleUserId } from "./auth";

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const userProjects = await ctx.db
        .query("projects")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();

      const systemProjects = await ctx.db
        .query("projects")
        .filter((q) => q.eq(q.field("type"), "system"))
        .collect();

      return [...userProjects, ...systemProjects];
    }

    return [];
  },
});

export const getProjectById = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const project = await ctx.db
        .query("projects")
        .filter((q) => q.eq(q.field("_id"), projectId))
        .collect();

      return project?.[0] || null;
    }

    return null;
  },
});

export const createAProject = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    try {
      const userId = await handleUserId(ctx);

      if (userId) {
        const newProjectId = await ctx.db.insert("projects", {
          userId,
          name,
          type: "user",
        });

        return newProjectId;
      }

      return null;
    } catch (error) {
      console.log("Error occurred during createAProject mutation");

      return null;
    }
  },
});
