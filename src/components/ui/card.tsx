import type { PropsWithChildren } from "react";
import { cn } from "@/lib/cn";

export const Card = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <article className={cn("rounded-xl border border-slate-200 bg-white p-4 shadow-card", className)}>{children}</article>
);
