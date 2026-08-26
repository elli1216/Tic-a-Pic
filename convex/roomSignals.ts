import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const sendSignal = mutation({
  args: {
    roomId: v.id("rooms"),
    sender: v.string(), // "host" | "guest"
    type: v.string(),   // "offer" | "answer" | "candidate"
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("roomSignals", {
      roomId: args.roomId,
      sender: args.sender,
      type: args.type,
      payload: args.payload,
    });
  },
});

export const getSignals = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("roomSignals")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});

export const clearSignals = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const signals = await ctx.db
      .query("roomSignals")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    for (const signal of signals) {
      await ctx.db.delete(signal._id);
    }
  },
});
