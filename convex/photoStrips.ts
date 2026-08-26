import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate an upload URL for saving a photo strip directly to Convex file storage
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save metadata for a newly uploaded photo strip
export const savePhotoStrip = mutation({
  args: {
    storageId: v.id("_storage"),
    thumbnailStorageId: v.optional(v.id("_storage")),
    cardLayout: v.string(), // "classic_strip_4x1", "grid_2x2"
    frameTheme: v.string(),
    isDuoMode: v.boolean(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);

    const photoStripId = await ctx.db.insert("photoStrips", {
      storageId: args.storageId,
      thumbnailStorageId: args.thumbnailStorageId,
      cardLayout: args.cardLayout,
      frameTheme: args.frameTheme,
      isDuoMode: args.isDuoMode,
      isPublic: args.isPublic,
      userId: authUserId || undefined,
    });
    return photoStripId;
  },
});

// Get a single photo strip by ID along with its serving storage URL
export const getPhotoStrip = query({
  args: {
    id: v.id("photoStrips"),
  },
  handler: async (ctx, args) => {
    const strip = await ctx.db.get(args.id);
    if (!strip) return null;

    const url = await ctx.storage.getUrl(strip.storageId);
    const thumbnailUrl = strip.thumbnailStorageId
      ? await ctx.storage.getUrl(strip.thumbnailStorageId)
      : null;

    return {
      ...strip,
      url,
      thumbnailUrl,
    };
  },
});

// List photo strips for the currently logged-in user
export const listMyPhotoStrips = query({
  args: {},
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return [];

    const strips = await ctx.db
      .query("photoStrips")
      .withIndex("by_user", (q) => q.eq("userId", authUserId))
      .order("desc")
      .take(50);

    return await Promise.all(
      strips.map(async (strip) => {
        const url = await ctx.storage.getUrl(strip.storageId);
        const thumbnailUrl = strip.thumbnailStorageId
          ? await ctx.storage.getUrl(strip.thumbnailStorageId)
          : null;
        return {
          ...strip,
          url,
          thumbnailUrl,
        };
      }),
    );
  },
});

// List recent public photo strips for a community gallery wall
export const listPublicPhotoStrips = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const strips = await ctx.db
      .query("photoStrips")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .order("desc")
      .take(limit);

    return await Promise.all(
      strips.map(async (strip) => {
        const url = await ctx.storage.getUrl(strip.storageId);
        const thumbnailUrl = strip.thumbnailStorageId
          ? await ctx.storage.getUrl(strip.thumbnailStorageId)
          : null;
        return {
          ...strip,
          url,
          thumbnailUrl,
        };
      }),
    );
  },
});
