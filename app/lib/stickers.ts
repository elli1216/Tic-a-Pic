export interface StickerPreset {
  id: string;
  category: "romance" | "y2k" | "retro" | "cute" | "words";
  type: "emoji" | "badge" | "stamp";
  content: string;
  label: string;
}

export const STICKER_PRESETS: StickerPreset[] = [
  // Romance & Couples
  { id: "heart-sparkle", category: "romance", type: "emoji", content: "💖", label: "Sparkle Heart" },
  { id: "heart-arrow", category: "romance", type: "emoji", content: "💘", label: "Cupid Arrow" },
  { id: "heart-fire", category: "romance", type: "emoji", content: "❤️‍🔥", label: "Heart on Fire" },
  { id: "kiss-mark", category: "romance", type: "emoji", content: "💋", label: "Kiss Mark" },
  { id: "cherry", category: "romance", type: "emoji", content: "🍒", label: "Cherries" },
  { id: "rose", category: "romance", type: "emoji", content: "🌹", label: "Red Rose" },

  // Y2K & Retro Aesthetic
  { id: "sparkles", category: "y2k", type: "emoji", content: "✨", label: "Sparkles" },
  { id: "star-glow", category: "y2k", type: "emoji", content: "⭐", label: "Gold Star" },
  { id: "dizzy-star", category: "y2k", type: "emoji", content: "💫", label: "Dizzy Star" },
  { id: "butterfly", category: "y2k", type: "emoji", content: "🦋", label: "Blue Butterfly" },
  { id: "sunglasses", category: "y2k", type: "emoji", content: "🕶️", label: "Retro Shades" },
  { id: "alien", category: "y2k", type: "emoji", content: "👾", label: "Retro Pixel" },

  // Cute & Aesthetic
  { id: "ribbon", category: "cute", type: "emoji", content: "🎀", label: "Cute Ribbon" },
  { id: "crown", category: "cute", type: "emoji", content: "👑", label: "Princess Crown" },
  { id: "teddy", category: "cute", type: "emoji", content: "🧸", label: "Teddy Bear" },
  { id: "cat-paw", category: "cute", type: "emoji", content: "🐾", label: "Paws" },
  { id: "flower-blossom", category: "cute", type: "emoji", content: "🌸", label: "Sakura Blossom" },
  { id: "camera", category: "cute", type: "emoji", content: "📸", label: "Retro Flash Cam" },

  // Words & Badges
  { id: "badge-love", category: "words", type: "badge", content: "LOVE ♡", label: "Love Badge" },
  { id: "badge-besties", category: "words", type: "badge", content: "BESTIES ✨", label: "Besties Badge" },
  { id: "badge-xoxo", category: "words", type: "badge", content: "XOXO", label: "XOXO Stamp" },
  { id: "badge-date", category: "words", type: "badge", content: "DATE NIGHT 🍷", label: "Date Night" },
  { id: "badge-forever", category: "words", type: "badge", content: "FOREVER 🕊️", label: "Forever" },
  { id: "badge-cute", category: "words", type: "badge", content: "TOO CUTE 🎀", label: "Too Cute" },
];
