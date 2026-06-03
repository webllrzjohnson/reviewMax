"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 w-9 rounded-md border border-zinc-700 bg-transparent",
          className,
        )}
        aria-hidden
      />
    );
  }

  function cycle() {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  }

  const Icon =
    theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  const label =
    theme === "light"
      ? "Switch to dark mode"
      : theme === "dark"
        ? "Switch to system theme"
        : "Switch to light mode";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border border-zinc-700 text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white",
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
