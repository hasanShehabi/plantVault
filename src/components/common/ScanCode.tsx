import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";

interface ScanCodeProps {
  code: string;
  label?: string;
}

export const ScanCode = ({ code, label = "Scan ID" }: ScanCodeProps) => {
  const { showToast } = useToast();
  const printRef = useRef<HTMLDivElement | null>(null);

  const printLabel = () => {
    if (!printRef.current) return;
    const win = window.open("", "_blank", "width=420,height=320");
    if (!win) return;
    win.document.write(`
      <html>
        <head><title>${code}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 16px;">
          ${printRef.current.outerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-all text-sm font-semibold text-slate-900">{code}</p>
      <div ref={printRef} className="mt-2 rounded border border-slate-200 p-2">
        <p className="text-xs text-slate-500">PlantVault Serial</p>
        <p className="mt-1 text-xl font-semibold tracking-wider text-slate-900">{code}</p>
      </div>
      <div className="mt-2 flex gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              showToast("Serial copied", "success");
            } catch {
              showToast("Could not copy serial on this browser", "error");
            }
          }}
        >
          Copy Serial
        </Button>
        <Button type="button" variant="ghost" onClick={printLabel}>
          Print Label
        </Button>
      </div>
    </div>
  );
};
