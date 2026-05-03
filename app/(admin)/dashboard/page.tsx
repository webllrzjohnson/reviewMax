import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("review_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(15);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Queue a topic for the n8n + Claude pipeline.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new-review">New review request</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent review requests</CardTitle>
          <CardDescription>
            Each row is logged when an admin submits the form. n8n should pick
            up the webhook and publish the finished post via the API route.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests && requests.length > 0 ? (
            <ul className="divide-y rounded-md border">
              {requests.map((r) => (
                <li key={r.id} className="px-4 py-3 text-sm">
                  <p className="font-medium">{r.product_name}</p>
                  <p className="text-muted-foreground">
                    {r.category_slug} ·{" "}
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                  {r.notes ? (
                    <p className="mt-1 text-muted-foreground">{r.notes}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No requests yet. Create one to test your n8n workflow.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
