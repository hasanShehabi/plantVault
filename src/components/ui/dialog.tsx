import { X } from "lucide-react";
import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface DialogProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title: string;
  className?: string;
}

export const Dialog = ({ open, onClose, title, className, children }: DialogProps) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <section
        className={cn("max-h-[92vh] w-full overflow-auto rounded-t-2xl bg-white p-4 sm:max-w-xl sm:rounded-2xl", className)}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <Button variant="secondary" onClick={onClose} aria-label="Close dialog" className="h-8 gap-1 px-2">
            <X size={16} />
            <span className="text-xs">Close</span>
          </Button>
        </header>
        {children}
      </section>
    </div>
  );
};
