import { useEffect, useRef, useState } from "react";
import { Camera, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type TextDetectorLike = {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
};

type TextDetectorCtor = new () => TextDetectorLike;

interface ScanSearchProps {
  onDetected: (code: string) => void;
}

export const ScanSearch = ({ onDetected }: ScanSearchProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const serialRegex = /PV-(?:PLANT|RES)-\d{4,}/i;

  const stopScanner = () => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (!open) {
      stopScanner();
      return;
    }

    const start = async () => {
      try {
        const Detector = (window as Window & { TextDetector?: TextDetectorCtor }).TextDetector;
        if (!Detector) {
          setError("OCR is not supported on this browser. Use manual code entry.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });
        streamRef.current = stream;

        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const detector = new Detector();

        intervalRef.current = window.setInterval(async () => {
          if (!videoRef.current) return;
          const blocks = await detector.detect(videoRef.current);
          const allText = blocks
            .map((block) => block.rawValue ?? "")
            .join(" ")
            .toUpperCase()
            .replace(/\s+/g, "");
          const matched = allText.match(serialRegex)?.[0];
          if (matched) {
            onDetected(matched);
            setOpen(false);
          }
        }, 350);
      } catch {
        setError("Could not run OCR. Check camera permissions and try again.");
      }
    };

    void start();

    return () => {
      stopScanner();
    };
  }, [open, onDetected]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="secondary" className="gap-2" onClick={() => { setError(null); setOpen(true); }}>
          <Camera size={16} />
          Scan Code
        </Button>
        <div className="flex min-w-[240px] flex-1 items-center gap-2 sm:flex-none">
          <Input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Enter scan code"
            aria-label="Enter scan code"
          />
          <Button
            type="button"
            variant="ghost"
            className="gap-1"
            onClick={() => {
              const trimmed = manualCode.trim();
              if (!trimmed) return;
              onDetected(trimmed);
            }}
          >
            <Search size={15} />
            Find
          </Button>
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Scan PlantVault Code">
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Point your camera at printed serial text like PV-PLANT-0001. OCR search runs automatically.</p>
          <video ref={videoRef} className="h-64 w-full rounded-lg border border-slate-200 bg-black object-cover" muted playsInline />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </Dialog>
    </>
  );
};
