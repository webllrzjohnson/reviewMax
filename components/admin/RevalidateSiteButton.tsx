"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { revalidateSiteAction } from "@/actions/posts";

export function RevalidateSiteButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const r = await revalidateSiteAction();
          if (r.ok) { toast.success(r.message); } else { toast.error(r.message); }
        })
      }
    >
      {pending ? "Clearing…" : "↻ Revalidate site"}
    </Button>
  );
}
