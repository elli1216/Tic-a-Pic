import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper to generate a friendly 6-character room code
function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const create = mutation({
  args: {
    hostUserId: v.optional(v.id("users")),
    selectedBackground: v.optional(v.string()),
    selectedFrame: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let roomCode = generateRoomCode();
    // Ensure uniqueness
    let existing = await ctx.db
      .query("rooms")
      .withIndex("by_code", (q) => q.eq("roomCode", roomCode))
      .first();

    while (existing) {
      roomCode = generateRoomCode();
      existing = await ctx.db
        .query("rooms")
        .withIndex("by_code", (q) => q.eq("roomCode", roomCode))
        .first();
    }

    const roomId = await ctx.db.insert("rooms", {
      roomCode,
      hostUserId: args.hostUserId,
      status: "waiting",
      selectedBackground: args.selectedBackground ?? "pastel-pink",
      selectedFrame: args.selectedFrame ?? "classic-white",
      currentShot: 0,
      triggerCountdownAt: undefined,
    });

    return { roomId, roomCode };
  },
});

export const getByCode = query({
  args: {
    roomCode: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_code", (q) => q.eq("roomCode", args.roomCode.toUpperCase().trim()))
      .first();
    return room;
  },
});

export const getById = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});

export const join = mutation({
  args: {
    roomCode: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_code", (q) => q.eq("roomCode", args.roomCode.toUpperCase().trim()))
      .first();

    if (!room) {
      throw new Error("Room not found. Please check the code and try again.");
    }

    if (room.status === "completed") {
      throw new Error("This photobooth session has already completed.");
    }

    // Update status to connected if currently waiting
    if (room.status === "waiting") {
      await ctx.db.patch(room._id, {
        status: "connected",
      });
    }

    return { roomId: room._id, roomCode: room.roomCode };
  },
});

export const updateSettings = mutation({
  args: {
    roomId: v.id("rooms"),
    selectedBackground: v.optional(v.string()),
    selectedFrame: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: Partial<{ selectedBackground: string; selectedFrame: string }> = {};
    if (args.selectedBackground !== undefined) {
      patch.selectedBackground = args.selectedBackground;
    }
    if (args.selectedFrame !== undefined) {
      patch.selectedFrame = args.selectedFrame;
    }
    await ctx.db.patch(args.roomId, patch);
  },
});

export const triggerCountdown = mutation({
  args: {
    roomId: v.id("rooms"),
    triggerCountdownAt: v.number(),
    currentShot: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      status: "shooting",
      triggerCountdownAt: args.triggerCountdownAt,
      ...(args.currentShot !== undefined ? { currentShot: args.currentShot } : {}),
    });
  },
});

export const updateShot = mutation({
  args: {
    roomId: v.id("rooms"),
    currentShot: v.number(),
    status: v.optional(
      v.union(
        v.literal("waiting"),
        v.literal("connected"),
        v.literal("shooting"),
        v.literal("completed")
      )
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      currentShot: args.currentShot,
      ...(args.status ? { status: args.status } : {}),
    });
  },
});

export const setStatus = mutation({
  args: {
    roomId: v.id("rooms"),
    status: v.union(
      v.literal("waiting"),
      v.literal("connected"),
      v.literal("shooting"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      status: args.status,
    });
  },
});
