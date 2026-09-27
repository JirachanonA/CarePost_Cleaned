"use client";

import { useEffect, useRef, useState } from "react";
import { SwitchCamera, X } from "lucide-react";

interface Props {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCamera(facing: "environment" | "user") {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setReady(false);
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.onloadedmetadata = () => setReady(true);
      }
    } catch {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.onloadedmetadata = () => setReady(true);
        }
      } catch {
        setError("Camera access denied. Use the file upload option instead.");
      }
    }
  }

  useEffect(() => {
    startCamera(facingMode);
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function flipCamera() {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    await startCamera(next);
  }

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    canvas.toBlob(blob => { if (blob) onCapture(blob); }, "image/jpeg", 0.92);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black" role="dialog" aria-label="Camera">
      <div className="relative flex-1 overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />

        {/* Document guide */}
        <div className="pointer-events-none absolute inset-x-6 bottom-8 top-24 rounded-[28px] ring-1 ring-white/25">
          <div className="absolute left-0 top-0 size-10 rounded-tl-[28px] border-l-4 border-t-4 border-white" />
          <div className="absolute right-0 top-0 size-10 rounded-tr-[28px] border-r-4 border-t-4 border-white" />
          <div className="absolute bottom-0 left-0 size-10 rounded-bl-[28px] border-b-4 border-l-4 border-white" />
          <div className="absolute bottom-0 right-0 size-10 rounded-br-[28px] border-b-4 border-r-4 border-white" />
        </div>

        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <button
            onClick={onClose}
            aria-label="Close camera"
            className="pressable flex size-12 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md"
          >
            <X className="size-6" />
          </button>
          <span className="rounded-full bg-black/45 px-4 py-2 text-[15px] font-semibold text-white backdrop-blur-md">
            Fit the page in the frame
          </span>
          <button
            onClick={flipCamera}
            aria-label="Switch camera"
            className="pressable flex size-12 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md"
          >
            <SwitchCamera className="size-6" />
          </button>
        </div>

        {error && (
          <div role="alert" className="absolute inset-x-4 top-24 rounded-2xl bg-white px-5 py-4 text-[17px] text-danger-ink">
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-center bg-black px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6">
        <button
          onClick={capture}
          disabled={!ready}
          className="pressable flex size-20 items-center justify-center rounded-full ring-4 ring-white disabled:opacity-40"
        >
          <span className="size-16 rounded-full bg-white" />
          <span className="sr-only">Take photo</span>
        </button>
      </div>
    </div>
  );
}
