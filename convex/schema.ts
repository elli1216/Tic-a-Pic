import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    isPremium: v.boolean(),
  }).index("by_token", ["tokenIdentifier"]),

  rooms: defineTable({
    roomCode: v.string(),
    hostUserId: v.optional(v.id("users")),
    status: v.union(
      v.literal("waiting"),
      v.literal("connected"),
      v.literal("shooting"),
      v.literal("completed")
    ),
    selectedBackground: v.string(),
    selectedFrame: v.string(),
    currentShot: v.number(), // 0 to 4
    triggerCountdownAt: v.optional(v.number()),
  }).index("by_code", ["roomCode"]),

  roomSignals: defineTable({
    roomId: v.id("rooms"),
    sender: v.string(), // "host" | "guest"
    type: v.string(),   // "offer" | "answer" | "candidate"
    payload: v.string(),
  }).index("by_room", ["roomId"]),

  photoStrips: defineTable({
    userId: v.optional(v.id("users")),
    storageId: v.id("_storage"),
    thumbnailStorageId: v.optional(v.id("_storage")),
    cardLayout: v.string(), // "classic_strip_4x1", "grid_2x2"
    frameTheme: v.string(),
    isDuoMode: v.boolean(),
    isPublic: v.boolean(),
  }).index("by_user", ["userId"]),
});
