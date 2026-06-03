"use client";

import { useState } from "react";
import { Sparkles, AlertCircle, CheckCircle2, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aiAssistAction, type AiAssistResult } from "@/actions/ai-assist";

export function AiAssistPanel({
  getValues,
}: {
  getValues: () => {
    title: string;
    excerpt: string;
    body: string;
    verdict: string;
    pros: string;
    cons: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AiAssistResult | null>(null);

  async function handleCheck() {
    setPending(true);
    setResult(null);
    setOpen(true);
    const vals = getValues();
    const res = await aiAssistAction(vals);
    setResult(res);
    setPending(false);
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden />
          <span className="text-sm font-semibold">AI Review Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCheck}
            disabled={pending}
            className="gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {pending ? "Checking…" : "Check draft"}
          </Button>
          {result && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={open ? "Collapse" : "Expand"}
            >
              {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {open && result && (
        <div className="border-t px-5 py-4 space-y-4 text-sm">
          {!result.ok ? (
            <p className="text-destructive">{result.message}</p>
          ) : (
            <>
              {result.issues && result.issues.length > 0 && (
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4" aria-hidden />
                    Issues found
                  </p>
                  <ul className="space-y-1 pl-5 list-disc marker:text-amber-500">
                    {result.issues.map((issue, i) => (
                      <li key={i} className="text-muted-foreground">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.issues?.length === 0 && (
                <p className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  No major issues found
                </p>
              )}

              {result.suggestions && result.suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 font-semibold">
                    <Lightbulb className="h-4 w-4 text-primary" aria-hidden />
                    Suggestions
                  </p>
                  <ul className="space-y-1 pl-5 list-disc marker:text-primary">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="text-muted-foreground">{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.titleAlternatives && result.titleAlternatives.length > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Title alternatives
                  </p>
                  <ul className="space-y-1">
                    {result.titleAlternatives.map((t, i) => (
                      <li
                        key={i}
                        className="rounded-md border bg-muted/40 px-3 py-2 font-medium"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
