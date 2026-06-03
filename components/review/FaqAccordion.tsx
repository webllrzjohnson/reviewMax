"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostFaq } from "@/types";

export function FaqAccordion({ faqs }: { faqs: PostFaq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="space-y-4">
      <h2 id="faq-heading" className="text-xl font-bold">
        Frequently asked questions
      </h2>
      <dl className="divide-y rounded-xl border">
        {faqs.map((faq, i) => (
          <div key={i}>
            <dt>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium hover:bg-muted/40 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    open === i && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
            </dt>
            {open === i && (
              <dd className="px-5 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
