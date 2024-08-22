import { v } from "convex/values";
import { query } from "./_generated/server";

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});

export const getProjectById = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("_id"), projectId))
      .collect();

    return project?.[0] || null;
  },
});
