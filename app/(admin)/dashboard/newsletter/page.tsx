import Link from "next/link";
import { getAllSubscribers } from "@/lib/admin-data";
import { NewsletterSendForm } from "@/components/admin/NewsletterSendForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NewsletterAdminPage() {
  const subscribers = await getAllSubscribers();
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Newsletter
          </h1>
          <p className="mt-1 text-muted-foreground">
            {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard">← Dashboard</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send newsletter</CardTitle>
            <CardDescription>
              Compose and send an email to all subscribers via Resend.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewsletterSendForm
              subscriberCount={subscribers.length}
              resendConfigured={resendConfigured}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
            <CardDescription>
              All {subscribers.length} addresses in the list
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscribers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No subscribers yet. The signup form is live at{" "}
                  <Link href="/" className="text-primary underline">
                    the homepage
                  </Link>
                .
              </p>
            ) : (
              <div className="max-h-96 overflow-y-auto rounded-lg border text-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/40 text-left text-muted-foreground">
                      <th className="px-4 py-2 font-medium">Email</th>
                      <th className="px-4 py-2 font-medium whitespace-nowrap">Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((s) => (
                      <tr key={s.id} className="border-b last:border-0">
                        <td className="px-4 py-2">{s.email}</td>
                        <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
                          {formatDate(s.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
