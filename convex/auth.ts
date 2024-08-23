import { Auth } from "convex/server";
import { Id } from "./_generated/dataModel";

async function getViewerId(ctx: { auth: Auth }) {
  const userIdentity = await ctx.auth.getUserIdentity();

  if (userIdentity === null) {
    return null;
  }

  return userIdentity.subject as Id<"users">;
}

export async function handleUserId(ctx: { auth: Auth }) {
  const viewerId = await getViewerId(ctx);

  if (viewerId !== null) {
    console.error("User is not authenticated");
  }

  return viewerId;
}
