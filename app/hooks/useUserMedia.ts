import { useState, useEffect, useRef, useCallback } from "react";

export interface MediaDeviceInfoSimple {
  deviceId: string;
  label: string;
}

export function useUserMedia() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfoSimple[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Enumerate connected video devices
  const refreshDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = deviceList
        .filter((d) => d.kind === "videoinput")
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${index + 1}`,
        }));
      setDevices(videoInputs);
    } catch {
      // Ignore enumeration failure
    }
  }, []);

  // Start camera stream
  const startStream = useCallback(
    async (deviceId?: string | null) => {
      setIsLoading(true);
      setError(null);

      // Stop previous tracks
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            deviceId: deviceId ? { exact: deviceId } : undefined,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: deviceId ? undefined : "user",
          },
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.playsInline = true;
          videoRef.current.muted = true;
          await videoRef.current.play().catch(() => {});
        }

        // Retrieve current device ID if not provided
        const currentTrack = mediaStream.getVideoTracks()[0];
        if (currentTrack) {
          const settings = currentTrack.getSettings();
          if (settings.deviceId) {
            setActiveDeviceId(settings.deviceId);
          }
        }

        await refreshDevices();
      } catch (err: unknown) {
        console.error("Camera access error:", err);
        const message =
          err instanceof Error
            ? err.name === "NotAllowedError"
              ? "Camera access was denied. Please allow camera permissions in your browser."
              : err.name === "NotFoundError"
              ? "No camera found on your device."
              : err.message
            : "Failed to connect to camera.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [stream, refreshDevices]
  );

  // Switch camera device
  const switchCamera = useCallback(
    async (deviceId: string) => {
      setActiveDeviceId(deviceId);
      await startStream(deviceId);
    },
    [startStream]
  );

  useEffect(() => {
    startStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    stream,
    devices,
    activeDeviceId,
    error,
    isLoading,
    switchCamera,
    restart: () => startStream(activeDeviceId),
  };
}
