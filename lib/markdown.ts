import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { transformSourceLinks } from "./source-links";

/** Clean orphan footnote references like [^7], \[^8], [2], \[1]\[6] */
function cleanFootnoteRefs(md: string): string {
  // Remove \[^N] and [^N] patterns (footnote markers)
  let result = md.replace(/\\?\[\^?\d+\]/g, "");
  // Remove leftover empty parens from cleaned refs
  result = result.replace(/\(\s*\)/g, "");
  return result;
}

/** Render markdown to HTML string. Cleans source citations, footnotes, renders GFM tables. */
export async function markdownToHtml(md: string): Promise<string> {
  let cleaned = transformSourceLinks(md);
  cleaned = cleanFootnoteRefs(cleaned);
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(cleaned);
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
