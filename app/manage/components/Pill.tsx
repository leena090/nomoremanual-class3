import type { ReactNode } from "react";

type Variant =
  | "accent"
  | "dark"
  | "neutral"
  | "success"
  | "warn"
  | "danger"
  | "mono";

export function Pill({
  variant = "neutral",
  dot = false,
  children,
}: {
  variant?: Variant;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span className={`pill pill--${variant}`}>
      {dot && <span className="dot"></span>}
      {children}
    </span>
  );
}
