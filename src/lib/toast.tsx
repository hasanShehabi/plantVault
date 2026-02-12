import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from "react";
import { cn } from "@/lib/cn";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  title: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (title: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, type: ToastType = "info") => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, title, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2600);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(340px,90vw)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "rounded-xl border bg-white px-4 py-3 text-sm shadow-card",
              toast.type === "success" && "border-brand-100",
              toast.type === "error" && "border-red-200",
            )}
            role="status"
            aria-live="polite"
          >
            {toast.title}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
