"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { saveCarePlan } from "@/lib/care-plan-storage";
import { demoExtract, samplePlan, wait } from "@/lib/demo";
import { CameraCapture } from "@/components/CameraCapture";
import { Camera, ChevronLeft, FileText, Image as ImageIcon, Loader2, Plus, Sparkles, Type, Upload, X } from "lucide-react";
import { Button, Disclaimer, Logo, Screen, Wordmark, cx } from "@/components/ui";

type View = "upload" | "review";

function FileIcon({ file }: { file: File }) {
  const Icon = file.type.startsWith("image/") ? ImageIcon : FileText;
  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky-wash text-brand-ink">
      <Icon className="size-6" />
    </span>
  );
}

function fileSize(file: File) {
  const kb = file.size / 1024;
  return kb < 1024 ? `${Math.round(kb)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

export default function UploadPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("upload");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showTextarea, setShowTextarea] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addFiles(incoming: File[]) {
    if (!incoming.length) return;
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      const deduped = incoming.filter((f) => !names.has(f.name));
      return [...prev, ...deduped];
    });
    setView("review");
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setView("upload");
      return next;
    });
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    addFiles(selected);
    e.target.value = "";
  }

  function onCameraCapture(blob: Blob) {
    setShowCamera(false);
    const file = new File([blob], `capture-${Date.now()}.jpg`, { type: blob.type });
    addFiles([file]);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    addFiles(dropped);
  }

  async function loadSample() {
    setError(null);
    setLoading(true);
    setLoadingMsg("Loading sample…");
    await wait(500);
    saveCarePlan(samplePlan());
    router.push("/plan");
  }

  // Demo mode: no documents leave the device; every path ends in the sample plan.
  async function run(pages: number) {
    setError(null);
    setLoading(true);
    try {
      saveCarePlan(await demoExtract(pages, setLoadingMsg));
      router.push("/plan");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      setLoadingMsg("");
    }
  }

  function extractText() {
    if (!text.trim()) { setError("Paste your discharge text first."); return; }
    run(1);
  }

  function processFiles() {
    run(files.length);
  }

  const busy = loading && (
    <div role="status" className="rise mt-4 flex items-center gap-3 rounded-[22px] bg-brand-wash px-5 py-4 text-left">
      <Loader2 className="size-6 shrink-0 animate-spin text-brand" />
      <p className="font-semibold text-brand-deep">{loadingMsg || "Working…"}</p>
    </div>
  );

  const errorBox = error && (
    <p role="alert" className="rise mt-4 rounded-[22px] bg-danger-wash px-5 py-4 text-left text-danger-ink">
      {error}
    </p>
  );

  return (
    <>
      {showCamera && (
        <CameraCapture onCapture={onCameraCapture} onClose={() => setShowCamera(false)} />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        className="hidden"
        onChange={onFileChange}
      />

      {view === "review" ? (
        <Screen className="lg:mx-auto lg:w-full lg:max-w-2xl">
          <header className="mb-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setView("upload")}
              aria-label="Back"
              className="pressable pill flex size-12 shrink-0 items-center justify-center rounded-pill"
            >
              <ChevronLeft className="size-6" strokeWidth={2.4} />
            </button>
            <div>
              <h1 className="display text-[28px] font-bold">Ready to read</h1>
              <p className="text-[15px] text-label-2">
                {files.length} page{files.length !== 1 ? "s" : ""} added
              </p>
            </div>
          </header>

          <ul className="flex flex-col gap-2.5">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                style={{ "--i": i } as React.CSSProperties}
                className="rise flex items-center gap-4 rounded-[24px] bg-white p-3 pr-2 shadow-card ring-1 ring-hairline"
              >
                <FileIcon file={file} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{file.name}</p>
                  <p className="text-[15px] text-label-3">{fileSize(file)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  disabled={loading}
                  aria-label={`Remove ${file.name}`}
                  className="pressable flex size-12 items-center justify-center rounded-pill text-label-3 active:bg-danger-wash active:text-danger disabled:opacity-40"
                >
                  <X className="size-5" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button onClick={() => fileInputRef.current?.click()} disabled={loading} className="px-4">
              <Plus className="size-5 text-brand" /> Add file
            </Button>
            <Button onClick={() => setShowCamera(true)} disabled={loading} className="px-4">
              <Camera className="size-5 text-brand" /> Add photo
            </Button>
          </div>

          {errorBox}
          {busy}

          <div className="mt-auto pt-8 lg:mt-8">
            <Button variant="primary" onClick={processFiles} disabled={loading} className="w-full">
              {loading ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
              {loading ? "Reading your papers…" : "Make my plan"}
            </Button>
            <p className="mt-3 text-center text-[15px] text-label-3">Usually takes 15–30 seconds.</p>
          </div>
        </Screen>
      ) : (
        <Screen className="items-center text-center lg:mx-auto lg:w-full lg:max-w-2xl">
          <div className="rise flex flex-col items-center lg:hidden">
            <Logo size={88} />
            <Wordmark className="-mt-1 text-[28px]" />
          </div>

          <h1 className="display mt-5 text-[30px] font-bold">Add your discharge papers</h1>
          <p className="mt-1.5 text-label-2">A photo, a PDF, or the text itself.</p>
          <p className="mt-3 rounded-pill bg-sun-wash px-4 py-1.5 text-[14px] font-semibold text-sun-ink">
            Demo: nothing is uploaded — you&apos;ll see a sample plan
          </p>

          {/* Upload well — the light-blue sheet from Figma */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={cx(
              "rise mt-6 flex w-full flex-col items-center rounded-[40px] bg-sky-wash px-6 pb-8 pt-10 ring-2 ring-inset transition-[box-shadow,background-color] duration-200",
              dragOver ? "bg-sky/60 ring-brand" : "ring-transparent"
            )}
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <span className="flex size-24 items-center justify-center rounded-[32px] bg-white shadow-card">
              <Upload className="size-12 text-sun" strokeWidth={2.6} />
            </span>
            <p className="mt-5 text-[19px] font-semibold">
              <span className="lg:hidden">Take a photo of each page</span>
              <span className="hidden lg:inline">Drag your files here</span>
            </p>
            <p className="mt-1 text-[15px] text-label-2">
              <span className="lg:hidden">Lay the paper flat in good light.</span>
              <span className="hidden lg:inline">PDFs or photos of each page — or use the buttons below.</span>
            </p>

            <Button variant="primary" onClick={() => setShowCamera(true)} disabled={loading} className="mt-6 w-full max-w-xs">
              <Camera className="size-5" strokeWidth={2.4} /> Take photos
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} disabled={loading} className="mt-3 w-full max-w-xs">
              <Upload className="size-5 text-sun" strokeWidth={2.4} /> Upload file
            </Button>
          </div>

          <div className="mt-4 grid w-full grid-cols-2 gap-3">
            <Button
              onClick={() => setShowTextarea((v) => !v)}
              aria-expanded={showTextarea}
              className="px-4 text-[16px]"
            >
              <Type className="size-5 text-brand" /> Paste text
            </Button>
            <Button onClick={loadSample} disabled={loading} className="px-4 text-[16px]">
              <Sparkles className="size-5 text-brand" /> Try sample
            </Button>
          </div>

          {showTextarea && (
            <div className="rise mt-4 w-full text-left">
              <label htmlFor="discharge-text" className="sr-only">Discharge instructions</label>
              <textarea
                id="discharge-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={7}
                placeholder="Paste your discharge instructions here…"
                className="w-full rounded-[24px] bg-surface p-5 text-[17px] outline-none ring-1 ring-hairline placeholder:text-label-3 focus:bg-white focus:ring-2 focus:ring-brand"
              />
              <Button variant="primary" onClick={extractText} disabled={loading || !text.trim()} className="mt-3 w-full">
                <Sparkles className="size-5" /> Make my plan
              </Button>
            </div>
          )}

          <div className="w-full">
            {errorBox}
            {busy}
          </div>

          <Disclaimer className="max-w-xs" />
        </Screen>
      )}
    </>
  );
}
