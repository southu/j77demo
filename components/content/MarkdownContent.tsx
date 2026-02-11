import type { ReactNode } from "react";

export function MarkdownContent({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`prose prose-stone max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
