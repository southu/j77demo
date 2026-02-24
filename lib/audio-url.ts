import fs from "fs";
import path from "path";

const PUBLIC = path.join(process.cwd(), "public");

/**
 * Get the public URL for an audio file if one exists.
 * Checks public/<tenant>/audio/<slug>.mp3.
 */
export function getAudioUrl(tenant: string, slug: string): string | null {
  const audioPath = path.join(PUBLIC, tenant, "audio", `${slug}.mp3`);
  if (!fs.existsSync(audioPath)) return null;
  return `/${encodeURIComponent(tenant)}/audio/${slug}.mp3`;
}
