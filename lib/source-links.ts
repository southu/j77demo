/**
 * Transform raw source citations in markdown into proper hyperlinks with friendly names.
 *
 * Handles patterns like:
 *   (Source: https://www.mckinsey.com/path/to/article)
 *   (Accenture: https://www.accenture.com/)
 *   (Source: https://insuranceblog.accenture.com/5-insurance-predictions-2026)
 *
 * Converts to:
 *   ([McKinsey](https://www.mckinsey.com/path/to/article))
 *   ([Accenture](https://www.accenture.com/))
 *
 * Leaves bracketed refs like (Source: [1]) untouched.
 */

/** Known domain → friendly name mappings */
const DOMAIN_NAMES: Record<string, string> = {
  "mckinsey.com": "McKinsey",
  "bcg.com": "BCG",
  "deloitte.com": "Deloitte",
  "accenture.com": "Accenture",
  "insuranceblog.accenture.com": "Accenture",
  "gartner.com": "Gartner",
  "forrester.com": "Forrester",
  "hbr.org": "Harvard Business Review",
  "wipfli.com": "Wipfli",
  "roots.ai": "Roots Automation",
  "jpmorgan.com": "J.P. Morgan",
  "indeed.com": "Indeed",
  "aarp.org": "AARP",
  "bls.gov": "Bureau of Labor Statistics",
  "linkedin.com": "LinkedIn",
  "gong.io": "Gong",
};

function friendlyName(url: string, prefix?: string): string {
  // If the citation already has a human label like "Accenture: https://...", use it
  if (prefix && prefix.trim() && prefix.trim().toLowerCase() !== "source") {
    return prefix.trim();
  }

  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    // Check exact hostname first, then second-level domain
    if (DOMAIN_NAMES[hostname]) return DOMAIN_NAMES[hostname]!;
    const parts = hostname.split(".");
    const sld = parts.slice(-2).join(".");
    if (DOMAIN_NAMES[sld]) return DOMAIN_NAMES[sld]!;
    // Fallback: capitalize second-level domain
    return parts[parts.length - 2]!.charAt(0).toUpperCase() + parts[parts.length - 2]!.slice(1);
  } catch {
    return "Source";
  }
}

/**
 * Transform source citations in markdown body text.
 * Does NOT touch frontmatter — pass only the body.
 */
export function transformSourceLinks(body: string): string {
  // Pattern 1: (Label: https://url) or (Source: https://url)
  let result = body.replace(
    /\(([^()]*?):\s*(https?:\/\/[^\s)]+)\)/g,
    (_match, label: string, url: string) => {
      const name = friendlyName(url, label);
      return `([${name}](${url.replace(/\)$/, "")}))`;
    }
  );

  // Pattern 2: Remove orphan "(Source: [N])" refs that have no URL
  result = result.replace(/\s*\(Source:\s*\[\d+\]\)/g, "");

  // Pattern 3: standalone bare URLs that aren't already in markdown links
  // e.g., "See https://example.com for details"
  // Skip if preceded by ]( or "
  result = result.replace(
    /(?<!\]\()(?<!")(?<!\()(https?:\/\/[^\s)>\]]+)/g,
    (url) => {
      // Don't re-wrap if already inside a markdown link
      const name = friendlyName(url);
      return `[${name}](${url})`;
    }
  );

  return result;
}
