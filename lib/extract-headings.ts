export type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/** Minimal slugifier matching rehype-slug / github-slugger behaviour. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Extract h2 / h3 headings from a markdown or HTML body string. */
export function extractHeadings(body: string): Heading[] {
  const headings: Heading[] = [];

  if (!body?.trim()) return headings;

  const isHtml = body.trim().startsWith("<") ||
    /<\s*\/?\s*(p|div|h[1-6])\b/i.test(body);

  if (isHtml) {
    const re = /<h([23])[^>]*>([\s\S]*?)<\/h\2>/gi;
    let match;
    while ((match = re.exec(body)) !== null) {
      const level = Number(match[1]) as 2 | 3;
      const text = match[2].replace(/<[^>]+>/g, "").trim();
      if (text) headings.push({ id: slugify(text), text, level });
    }
  } else {
    const lines = body.split("\n");
    for (const line of lines) {
      const h2 = line.match(/^##\s+(.+)/);
      const h3 = line.match(/^###\s+(.+)/);
      if (h2) {
        const text = h2[1].trim();
        headings.push({ id: slugify(text), text, level: 2 });
      } else if (h3) {
        const text = h3[1].trim();
        headings.push({ id: slugify(text), text, level: 3 });
      }
    }
  }

  return headings;
}
