import { cn } from "@/lib/utils";

export function SpecTable({
  leftTitle,
  rightTitle,
  leftSpecs,
  rightSpecs,
}: {
  leftTitle: string;
  rightTitle: string;
  leftSpecs: Record<string, string>;
  rightSpecs: Record<string, string>;
}) {
  const allKeys = Array.from(
    new Set([...Object.keys(leftSpecs), ...Object.keys(rightSpecs)]),
  );

  if (allKeys.length === 0) return null;

  return (
    <section className="space-y-4" aria-label="Spec comparison">
      <h2 className="text-xl font-bold">Specs comparison</h2>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-1/3">
                Spec
              </th>
              <th className="px-4 py-3 text-left font-medium w-1/3">
                {leftTitle}
              </th>
              <th className="px-4 py-3 text-left font-medium w-1/3">
                {rightTitle}
              </th>
            </tr>
          </thead>
          <tbody>
            {allKeys.map((key) => {
              const lv = leftSpecs[key];
              const rv = rightSpecs[key];
              const bothHave = lv && rv;
              const diff = bothHave && lv !== rv;
              return (
                <tr
                  key={key}
                  className={cn(
                    "border-b last:border-0",
                    diff && "bg-amber-50/40 dark:bg-amber-950/10",
                  )}
                >
                  <td className="px-4 py-3 font-medium text-muted-foreground">
                    {key}
                  </td>
                  <td className={cn("px-4 py-3", !lv && "text-muted-foreground/40")}>
                    {lv ?? "—"}
                  </td>
                  <td className={cn("px-4 py-3", !rv && "text-muted-foreground/40")}>
                    {rv ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
