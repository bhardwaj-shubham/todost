import { v } from "convex/values";
import { query } from "./_generated/server";

export const getLabels = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("labels").collect();
  },
});

export const getLabelById = query({
  args: {
    labelId: v.id("labels"),
  },
  handler: async (ctx, { labelId }) => {
    const label = await ctx.db
      .query("labels")
      .filter((q) => q.eq(q.field("_id"), labelId))
      .collect();

    return label?.[0] || null;
  },
});
