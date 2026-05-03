import DOMPurify from "isomorphic-dompurify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function isProbablyHtml(htmlOrMarkdown: string): boolean {
  const t = htmlOrMarkdown.trim();
  if (!t) return false;
  if (t.startsWith("<")) return true;
  return /<\s*\/?\s*(p|div|article|section|h[1-6]|ul|ol|li|br|img|a|strong|em|span|blockquote)\b/i.test(
    htmlOrMarkdown,
  );
}

const proseClass =
  "prose prose-neutral dark:prose-invert max-w-none prose-img:rounded-lg prose-a:text-primary";

/** Renders stored HTML (sanitized) or falls back to Markdown for legacy content. */
export function PostBody({ body }: { body: string }) {
  if (isProbablyHtml(body)) {
    return (
      <div
        className={proseClass}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(body, { USE_PROFILES: { html: true } }),
        }}
      />
    );
  }

  return (
    <div className={proseClass}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  );
}
