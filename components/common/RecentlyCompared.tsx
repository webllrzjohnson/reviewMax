"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GitCompare } from "lucide-react";
import { loadCompareEntries, type CompareEntry } from "@/components/review/CompareRecorder";

export function RecentlyCompared() {
  const [entries, setEntries] = useState<CompareEntry[]>([]);

  useEffect(() => {
    setEntries(loadCompareEntries());
  }, []);

  if (entries.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Recently compared
      </h2>
      <ul className="mt-3 space-y-2">
        {entries.map((e) => (
          <li key={`${e.left}-${e.right}`}>
            <Link
              href={`/compare?left=${encodeURIComponent(e.left)}&right=${encodeURIComponent(e.right)}`}
              className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              <GitCompare className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
              <span className="line-clamp-2">
                {e.leftTitle} <span className="font-medium text-foreground/50">vs</span> {e.rightTitle}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
