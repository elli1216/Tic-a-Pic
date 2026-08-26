# 📸 Tic-a-Pic Photobooth: Engineering & Product Blueprint

Tic-a-Pic Photobooth is a retro-modern, couples-focused web photobooth that runs client-side AI background segmentation, supports local single-camera and long-distance dual-camera sessions via WebRTC, and uses Convex for real-time room signaling, authentication, and persistent cloud storage.

---

## 1. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          React Frontend                                │
│                                                                        │
│  ┌──────────────────────┐  ┌────────────────────┐  ┌────────────────┐  │
│  │   Zustand Stores     │  │ MediaPipe / WebGL  │  │  HTML5 Canvas  │  │
│  │  (Booth/Room/Auth)   │  │ (AI Segmentation)  │  │ (Compositor)   │  │
│  └──────────────────────┘  └────────────────────┘  └────────────────┘  │
│             │                        │                     │           │
│             ▼                        ▼                     ▼           │
│     Framer Motion UI         Live Matting & Mask      PNG/GIF Strip    │
└─────────────┬────────────────────────┬─────────────────────┬───────────┘
              │                        │                     │
              │ WebRTC Peer Connection │                     │
              │ (Video Stream Exchange)│                     │
              ▼                        │                     │
┌─────────────────────────┐            │                     │
│ Remote Partner Browser  │            │                     │
└─────────────────────────┘            │                     │
              │                        │                     │
              ▼                        ▼                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         Convex Real-Time Backend                       │
│                                                                        │
│   • Auth (Anonymous / Registered)   • WebRTC Signaling (Rooms)         │
│   • Photo Strip Metadata Storage    • Binary File Storage (CDN)        │
└────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Core Technical Architecture & Solutions

### A. Client-Side Background Removal

* **Library:** `@mediapipe/selfie_segmentation` or `@tensorflow-models/body-segmentation`.
* **Execution:** Runs locally in the browser via WebAssembly/WebGL at 30–60 FPS.
* **Pipeline:**

1. Capture raw video feed via `navigator.mediaDevices.getUserMedia()`.
2. Feed each video frame into MediaPipe to generate a binary foreground mask.
3. Draw the user's selected virtual background image/color onto an off-screen `<canvas>`.
4. Use `globalCompositeOperation = 'destination-out'` (or WebGL shaders) to draw the inverted mask and overlay the segmented couple.

### B. Long-Distance Duo Mode (Split/Combined Cameras)

* **Signaling:** Convex database tables (`rooms` & `room_signals`) act as the low-latency WebSocket signaling channel to exchange ICE candidates and SDP offers/answers.
* **P2P Video:** WebRTC stream transmits the remote partner's feed.
* **Dual Matting & Compositing:**
* Segment local camera feed $\rightarrow$ isolate Partner A.
* Segment remote WebRTC feed $\rightarrow$ isolate Partner B.
* Composite Partner A and Partner B side-by-side or overlapping onto a single canvas with the shared selected background.

* **Sync Shutter:** Convex emits a synced timestamp (e.g., `triggerAt = Date.now() + 3000`). Both clients run a synchronized countdown and capture the combined canvas state at the exact millisecond.

### C. 4-Shot Card Generator & Renderer

* High-resolution offscreen canvas (typically `1200 x 3600 px` for 300 DPI 2x6 photostrips or `1600 x 2400 px` for 4x6 postcards).
* Renders the 4 captured frames, selected frame skin, decorative stamps/stickers, custom text, and a date/location stamp.
* Exports directly to `image/png` or animated `image/gif`.

---

## 3. Convex Database Schema

```typescript
// convex/schema.ts
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

```

---

## 4. State Management (Zustand) & Validation (Zod)

### Zod Schemas

```typescript
// src/schemas/booth.ts
import { z } from "zod";

export const FrameSkinSchema = z.object({
  id: z.string(),
  name: z.string(),
  isPremium: z.boolean(),
  aspectRatio: z.enum(["strip_2x6", "card_4x6"]),
  frameUrl: z.string().url(),
  backgroundColor: z.string(),
  overlayUrl: z.optional(z.string().url()),
});

export const CaptureSettingsSchema = z.object({
  mode: z.enum(["solo", "duo_local", "duo_remote"]),
  countdownSeconds: z.number().min(3).max(10),
  flashEffect: z.boolean(),
  selectedBackgroundId: z.string(),
  selectedFrameId: z.string(),
});

```

### Zustand Store Structure

```typescript
// src/stores/useBoothStore.ts
import { create } from "zustand";

interface BoothState {
  step: "setup" | "room-lobby" | "countdown" | "capturing" | "customize" | "export";
  mode: "solo" | "duo_local" | "duo_remote";
  capturedImages: string[]; // 4 data URLs / ImageBitmaps
  currentShotIndex: number;
  selectedBackground: string;
  selectedFrame: string;
  isSegmentationReady: boolean;
  
  // Actions
  setStep: (step: BoothState["step"]) => void;
  setMode: (mode: BoothState["mode"]) => void;
  addCapturedImage: (img: string) => void;
  resetBooth: () => void;
  setSelectedBackground: (bg: string) => void;
  setSelectedFrame: (frame: string) => void;
}

export const useBoothStore = create<BoothState>((set) => ({
  step: "setup",
  mode: "solo",
  capturedImages: [],
  currentShotIndex: 0,
  selectedBackground: "pastel-pink",
  selectedFrame: "classic-white",
  isSegmentationReady: false,

  setStep: (step) => set({ step }),
  setMode: (mode) => set({ mode }),
  addCapturedImage: (img) =>
    set((state) => ({
      capturedImages: [...state.capturedImages, img],
      currentShotIndex: state.currentShotIndex + 1,
    })),
  resetBooth: () =>
    set({
      step: "setup",
      capturedImages: [],
      currentShotIndex: 0,
    }),
  setSelectedBackground: (bg) => set({ selectedBackground: bg }),
  setSelectedFrame: (frame) => set({ selectedFrame: frame }),
}));

```

---

## 5. UI/UX Flow & Screen Breakdown

| Step | View Name | Key User Actions & Animations |
| --- | --- | --- |
| **01** | **Landing & Mode Select** | Toggle between "In-Person Couple" and "Long-Distance Duo". Animated retro photobooth curtain entry (`framer-motion`). |
| **02** | **Lobby / Connection** | If *Duo Mode*: Host generates a 6-digit room code; Guest joins. WebRTC stream establishes; live dual-matting preview shows both people merged. |
| **03** | **Menu & Customizer Prep** | Choose virtual background (Studio White, Paris Cafe, 90s Grain, Cyberpunk, Custom Upload) and initial frame theme. |
| **04** | **The Shoot (4 Shots)** | Retro shutter sounds, pulsing 3-2-1 countdown overlay, full-screen white flash on capture. Progress bar tracks `Shot X of 4`. |
| **05** | **Design & Decorate** | Add Y2K/Retro stickers, change border styles, toggle timestamp/custom handwritten names, adjust color grading filters. |
| **06** | **Export & Cloud Save** | **Free:** Instant PNG/GIF download. **Auth Wall (Optional):** "Save to Vault" prompt via Convex Auth to generate a permanent link and personal gallery. |

---

## 6. Detailed Feature Specifications

### Free Tier vs. Premium Tier

| Feature | Free (No Login Needed) | Premium (Logged-in / Paid) |
| --- | --- | --- |
| **Account Requirement** | None (Immediate access) | Convex Auth (Google/Email) |
| **Photocard Layouts** | Standard 2x6 4-panel vertical strip | 4x6 grid, Polaroid multi-card, Heart collage |
| **Frames & Borders** | Classic White, Matte Black, Pastel | Holo, Retro 2000s, Y2K metallics, Custom text |
| **Virtual Backgrounds** | 10 default solid colors & scenes | 50+ animated loops, custom image upload |
| **Output Formats** | High-Res PNG | High-Res PNG + Animated Making-Of GIF |
| **Cloud Storage** | Local Browser Download only | Permanent cloud gallery + shareable QR code link |

### Long-Distance Video Processing Flow

1. **Host** creates room `ROOM-123` on Convex.
2. **Guest** connects; Convex triggers WebRTC handshake via `roomSignals`.
3. Both clients receive raw WebRTC streams.
4. Each client extracts their local video and the peer's remote video.
5. Client-side MediaPipe isolates foregrounds:

$$\text{Frame}_{\text{final}} = \text{BG}_{\text{selected}} \oplus \text{Person}_{\text{local}} \oplus \text{Person}_{\text{remote}}$$

1. Host clicks "Take Photos". Convex sets `triggerCountdownAt = Date.now() + 3000`.
2. Countdown synchronizes $\rightarrow$ Canvas freezes & snapshots 4 sequential frames.

---

## 7. Implementation Roadmap

### Phase 1: Core Vision & Canvas Pipeline

* Setup React + Vite + Tailwind + Framer Motion.
* Implement camera feed hook (`useUserMedia`) with device switching.
* Integrate `@mediapipe/selfie_segmentation` on an animation frame loop.
* Build background replacement canvas pipeline (Color, Texture, Image).

### Phase 2: Shutter Sequence & Canvas Compositor

* Build the automated 4-shot scheduler with audio-visual countdowns.
* Develop the 4-panel strip generator on offscreen canvas.
* Add drag-and-drop stickers, filters (B&W, Vintage Warm, Film Grain), and text overlays.
* Implement client-side direct PNG and GIF generation.

### Phase 3: Convex Backend & Authentication

* Deploy Convex backend schema for `users`, `photoStrips`, and storage.
* Integrate Convex Auth for optional user login.
* Implement image upload to Convex file storage (`generateUploadUrl`).
* Build user dashboard to view past saved photostrips.

### Phase 4: Long-Distance Duo WebRTC Integration

* Create Convex signaling tables (`rooms`, `roomSignals`).
* Build WebRTC peer connection abstraction hook.
* Implement dual-feed video canvas compositing (Local + Remote segmentation).
* Synced clock countdown triggers across both browsers.

### Phase 5: Polish & Animations

* Add curtain-opening entry and exit transitions using Framer Motion.
* Sound effects for camera shutter, motor-print ejection, and countdown beeps.
* Mobile responsive touch layout optimization (portrait camera support).
