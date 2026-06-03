"use client";

import { useEffect } from "react";

const KEY = "verdict_recent_compares";
const MAX = 5;

export interface CompareEntry {
  left: string;
  right: string;
  leftTitle: string;
  rightTitle: string;
  ts: number;
}

export function saveCompareEntry(entry: Omit<CompareEntry, "ts">) {
  try {
    const raw = localStorage.getItem(KEY);
    const existing: CompareEntry[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter(
      (e) =>
        !(
          (e.left === entry.left && e.right === entry.right) ||
          (e.left === entry.right && e.right === entry.left)
        ),
    );
    const updated = [{ ...entry, ts: Date.now() }, ...filtered].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function loadCompareEntries(): CompareEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CompareRecorder({
  left,
  right,
  leftTitle,
  rightTitle,
}: {
  left: string;
  right: string;
  leftTitle: string;
  rightTitle: string;
}) {
  useEffect(() => {
    saveCompareEntry({ left, right, leftTitle, rightTitle });
  }, [left, right, leftTitle, rightTitle]);

  return null;
}
