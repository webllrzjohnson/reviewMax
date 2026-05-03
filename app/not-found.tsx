import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20">
      <p className="text-sm font-semibold uppercase text-muted-foreground">
        404
      </p>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="max-w-md text-center text-muted-foreground">
        The page you requested does not exist or was moved.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
