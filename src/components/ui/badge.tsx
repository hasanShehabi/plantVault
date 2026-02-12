import { cn } from "@/lib/cn";

interface BadgeProps {
  children: string;
  tone?: "neutral" | "success" | "warning" | "danger";
}

export const Badge = ({ children, tone = "neutral" }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
      tone === "neutral" && "bg-slate-100 text-slate-700",
      tone === "success" && "bg-emerald-100 text-emerald-700",
      tone === "warning" && "bg-amber-100 text-amber-700",
      tone === "danger" && "bg-red-100 text-red-700",
    )}
  >
    {children}
  </span>
);
