"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { cn } from "@/lib/utils";
import { Eye, PenLine, Columns2 } from "lucide-react";

type Mode = "edit" | "preview" | "split";

export function MarkdownEditorField({
  id,
  value,
  onChange,
  rows = 12,
  className,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
}) {
  const [mode, setMode] = useState<Mode>("edit");

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 rounded-lg border bg-muted/30 p-1 w-fit">
        <button
          type="button"
          onClick={() => setMode("edit")}
          className={cn(
            "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors",
            mode === "edit"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <PenLine className="h-3.5 w-3.5" aria-hidden />
          Edit
        </button>
        <button
          type="button"
          onClick={() => setMode("split")}
          className={cn(
            "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors",
            mode === "split"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Columns2 className="h-3.5 w-3.5" aria-hidden />
          Split
        </button>
        <button
          type="button"
          onClick={() => setMode("preview")}
          className={cn(
            "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors",
            mode === "preview"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Eye className="h-3.5 w-3.5" aria-hidden />
          Preview
        </button>
      </div>

      <div
        className={cn(
          mode === "split" ? "grid gap-3 lg:grid-cols-2" : undefined,
        )}
      >
        {/* Editor pane */}
        {mode !== "preview" && (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className={cn(
              "w-full rounded-md border bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y",
              className,
            )}
          />
        )}

        {/* Preview pane */}
        {mode !== "edit" && (
          <div
            className={cn(
              "prose prose-neutral dark:prose-invert max-w-none overflow-y-auto rounded-md border bg-muted/10 px-4 py-3 text-sm",
              mode === "split" ? `max-h-[${rows * 1.5}rem]` : undefined,
            )}
            style={mode === "split" ? { maxHeight: `${rows * 1.5}rem` } : undefined}
            aria-label="Markdown preview"
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
