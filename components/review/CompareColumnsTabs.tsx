"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function CompareColumnsTabs({
  leftTitle,
  rightTitle,
  leftColumn,
  rightColumn,
}: {
  leftTitle: string;
  rightTitle: string;
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}) {
  const [active, setActive] = useState<"left" | "right">("left");

  return (
    <>
      {/* Mobile tab switcher — hidden on lg+ where both columns show */}
      <div className="flex rounded-xl border overflow-hidden lg:hidden">
        <button
          type="button"
          onClick={() => setActive("left")}
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
            active === "left"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/40 text-muted-foreground hover:bg-muted",
          )}
        >
          {leftTitle}
        </button>
        <button
          type="button"
          onClick={() => setActive("right")}
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors border-l",
            active === "right"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/40 text-muted-foreground hover:bg-muted",
          )}
        >
          {rightTitle}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className={cn(active === "right" && "hidden lg:block")}>
          {leftColumn}
        </div>
        <div className={cn(active === "left" && "hidden lg:block")}>
          {rightColumn}
        </div>
      </div>
    </>
  );
}
