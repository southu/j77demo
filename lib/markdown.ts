import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

/** Render markdown to HTML string. */
export async function markdownToHtml(md: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(md);
  return String(result.value);
}

/** Split markdown by ## headings; returns [beforeSecondHeading, afterSecondHeading] or [fullContent, ""]. */
export function splitBySecondHeading(md: string): [string, string] {
  const headingRegex = /^##\s+/gm;
  const matches = [...md.matchAll(headingRegex)];
  if (matches.length < 2) return [md, ""];
  const secondIndex = matches[1]!.index!;
  return [md.slice(0, secondIndex), md.slice(secondIndex)];
}
