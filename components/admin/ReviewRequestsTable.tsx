"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import type { ReviewRequest } from "@/types";
import { deleteReviewRequestAction } from "@/actions/review-requests-admin";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ReviewRequestsTable({
  requests,
}: {
  requests: ReviewRequest[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (requests.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/30 p-10 text-center text-sm text-muted-foreground">
        No review requests yet. Suggestions submitted via{" "}
        <a href="/suggest" target="_blank" className="text-primary underline">
          /suggest
        </a>{" "}
        will appear here.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Amazon URL</th>
            <th className="px-4 py-3 font-medium">Notes</th>
            <th className="px-4 py-3 font-medium">Submitted</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="max-w-[200px] px-4 py-3 align-top font-medium">
                {r.product_name}
              </td>
              <td className="px-4 py-3 align-top text-muted-foreground">
                {r.category_slug}
              </td>
              <td className="px-4 py-3 align-top">
                <Badge variant={r.created_by ? "default" : "secondary"}>
                  {r.created_by ? "Admin" : "Public"}
                </Badge>
              </td>
              <td className="px-4 py-3 align-top">
                <a
                  href={r.amazon_url}
                  className="max-w-[180px] truncate text-primary underline block"
                  target="_blank"
                  rel="noopener noreferrer"
                  title={r.amazon_url}
                >
                  {r.amazon_url}
                </a>
              </td>
              <td className="max-w-[200px] px-4 py-3 align-top text-muted-foreground">
                {r.notes ? (
                  <span className="line-clamp-2" title={r.notes}>
                    {r.notes}
                  </span>
                ) : (
                  <span className="opacity-40">—</span>
                )}
              </td>
              <td className="px-4 py-3 align-top text-muted-foreground whitespace-nowrap">
                {formatDate(r.created_at)}
              </td>
              <td className="px-4 py-3 align-top text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pending}
                    >
                      Dismiss
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Dismiss this request?</AlertDialogTitle>
                      <AlertDialogDescription>
                        &ldquo;{r.product_name}&rdquo; will be removed from the
                        queue. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          startTransition(async () => {
                            const res = await deleteReviewRequestAction(r.id);
                            if (res.ok) {
                              toast.success("Request dismissed.");
                              router.refresh();
                            } else {
                              toast.error(res.message ?? "Could not dismiss.");
                            }
                          })
                        }
                      >
                        Dismiss
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
