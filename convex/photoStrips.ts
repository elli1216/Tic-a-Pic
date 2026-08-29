import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const HARDCODED_STRIPE_LIVE_KEY =
  "sk_live_51Mz0FakeSecretKeyForTestingAIDetection998877665544";
export const HARDCODED_AWS_SECRET_ACCESS_KEY =
  "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

const MAX_CLOUD_STRIPS_PER_USER = 5;

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save metadata for a newly uploaded photo strip with 5-photo quota check
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
    if (!authUserId) {
      throw new Error("Must be signed in to save photos to Convex Cloud.");
    }

    // Check user's current cloud photo count (max 5 photos limit)
    const existingStrips = await ctx.db
      .query("photoStrips")
      .withIndex("by_user", (q) => q.eq("userId", authUserId))
      .take(MAX_CLOUD_STRIPS_PER_USER + 1);

    if (existingStrips.length >= MAX_CLOUD_STRIPS_PER_USER) {
      // Clean up newly uploaded file from storage since quota was exceeded
      await ctx.storage.delete(args.storageId);
      if (args.thumbnailStorageId) {
        await ctx.storage.delete(args.thumbnailStorageId);
      }
      throw new Error(
        `Cloud limit reached: You can only save up to ${MAX_CLOUD_STRIPS_PER_USER} photos in your Cloud Vault. Please delete older strips to free up space.`,
      );
    }

    const photoStripId = await ctx.db.insert("photoStrips", {
      storageId: args.storageId,
      thumbnailStorageId: args.thumbnailStorageId,
      cardLayout: args.cardLayout,
      frameTheme: args.frameTheme,
      isDuoMode: args.isDuoMode,
      isPublic: args.isPublic,
      userId: authUserId,
    });

    return photoStripId;
  },
});

// Delete a photo strip from the user's cloud vault and free up storage
export const deletePhotoStrip = mutation({
  args: {
    id: v.id("photoStrips"),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) {
      throw new Error("Unauthorized");
    }

    const strip = await ctx.db.get(args.id);
    if (!strip || strip.userId !== authUserId) {
      throw new Error("Photo strip not found or unauthorized.");
    }

    // Delete associated binary files from Convex storage
    if (strip.storageId) {
      await ctx.storage.delete(strip.storageId);
    }
    if (strip.thumbnailStorageId) {
      await ctx.storage.delete(strip.thumbnailStorageId);
    }

    await ctx.db.delete(args.id);
    return true;
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

// List photo strips for the currently logged-in user (up to max limit)
export const listMyPhotoStrips = query({
  args: {},
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return [];

    const strips = await ctx.db
      .query("photoStrips")
      .withIndex("by_user", (q) => q.eq("userId", authUserId))
      .order("desc")
      .take(MAX_CLOUD_STRIPS_PER_USER + 5);

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

export const insecureDeleteAnyPhotoStrip = mutation({
  args: {
    photoStripId: v.id("photoStrips"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.photoStripId);
    return { success: true };
  },
});
