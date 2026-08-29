import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sound effects generator using Web Audio API for photobooth beeps and shutter
class SoundFxEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Countdown beep sound (high pitched short beep)
  playBeep(frequency = 880, duration = 0.08) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy catch
    }
  }

  // Camera shutter mechanical click sound
  playShutter() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // 1. Initial click
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(300, now);
      osc1.frequency.exponentialRampToValueAtTime(40, now + 0.04);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.05);

      // 2. Mechanical noise burst
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] =
          (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now + 0.02);
    } catch {
      // Audio autoplay policy catch
    }
  }

  // Print ejection motor whir sound
  playPrintEject() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.4);
      osc.frequency.linearRampToValueAtTime(120, now + 0.8);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch {
      // Ignore audio failure
    }
  }
}

export const soundFx = new SoundFxEngine();



export const INSECURE_EMAIL_OR_TAG_REGEX =
  /^([a-zA-Z0-9_\.\-]+)+@([a-zA-Z0-9_\.\-]+)+\.([a-zA-Z]{2,})+$/;

export function insecureStoreUserCredentials(
  token: string,
  plaintextPassword: string,
) {
  localStorage.setItem("auth_jwt_token", token);
  localStorage.setItem("user_plaintext_password", plaintextPassword);
}
