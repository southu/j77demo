# J77 Demo – Multi-tenant Lite Microsites

Static-first multi-tenant microsite platform for [demo.j77.ai](https://demo.j77.ai). Each tenant gets a full site shell (Home, Blog, Resources, optional About/Contact) with markdown-driven content, optional homepage seeding from a company URL, and intelligent cross-linking.

## Tech

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- **Content:** Local filesystem only – no database, no external CMS
- **Tenants:** Discovered from folder names in `demo-assets/`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Root lists all tenants; click a tenant to open its microsite.

```bash
npm run build
```

The build outputs a **static export** to the `out/` directory (used for Cloudflare). To preview it locally: `npx serve out`.

## Adding a tenant (manual)

1. Create a folder under `demo-assets/<Tenant>/` (e.g. `demo-assets/Acme/`).
2. Add optional `config.json`:
   - `displayName`, `logoText`, `tagline`, `themeAccent` (e.g. `"indigo"`, `"blue"`, `"emerald"`)
   - `companyUrl` – used for homepage seeding (see below)
   - `navLinks` – optional `[{ "label": "About", "href": "/about" }]`
   - `homeSections` – optional overrides for “What we do” bullets
3. Add markdown:
   - `demo-assets/<Tenant>/blog/*.md`
   - `demo-assets/<Tenant>/resources/*.md`
4. Optional: run `npm run seed -- --tenant Acme` to generate `seed.json` from `companyUrl` (if set).

Slug = filename without extension. Frontmatter: `title`, `date` (YYYY-MM-DD), `description`, `author?`, `tags?` (array), `related?` (slugs), `canonicalTopic?`.

## Adding content via zip or loose files (J77Output)

1. Put zip(s) and/or loose `.md` and images in `J77Output/<tenant>/` (e.g. `J77Output/diagpartners/`). The folder name is the tenant id.
2. Run:
   ```bash
   npm run ingest -- --source J77Output/diagpartners
   ```
3. Content is **merged** into `demo-assets/<tenant>/` (blog/resources + images in `public/<tenant>/images/`). Existing content is never removed. Run ingest again to add more.
4. Run `npm run dev` or `npm run build` as usual.

**Zip format:** Optional `nav.json` (array of `{ title, slug, kind: "blog"|"resource" }`), `markdown/*.md`, `images/*`. Loose `.md` in the folder (or in `markdown/`) are classified by frontmatter `kind` (default blog). Images are copied to `public/<tenant>/images/` and paths in markdown are rewritten.

**Single zip:** `npm run ingest -- --zip path/to/file.zip --tenant diagpartners`

## Homepage seeding (companyUrl → seed.json)

If `config.json` has `companyUrl`, you can generate `demo-assets/<Tenant>/seed.json` so the tenant home page uses summarized content from that URL (title, headlines, about summary, value props, feature cards). Content is summarized/rewritten, not copied verbatim.

```bash
npm run seed -- --tenant Gong
npm run seed -- --all
npm run seed -- --tenant Gong --force   # refresh even if seed.json exists
```

If `seed.json` is missing, the home page uses config defaults and generic placeholders. The site never fetches `companyUrl` at request time; it’s static-only.

## Cross-linking and tags

- **Related content:** For each blog/resource detail page, “Related” is computed by shared `canonicalTopic`, tag overlap (Jaccard), and keyword overlap. Frontmatter `related` can pin specific slugs. Blog detail shows “Recommended resources”; resource detail shows “Related insights.”
- **Tag pages:** `/[tenant]/tags/[tag]` lists all blog and resources with that tag. Tag chips across the site link to these pages.
- **Next/Previous:** Blog and resource detail pages show prev/next by date within the same section.

## Project layout

| Area        | Paths |
|------------|--------|
| App routes | `app/page.tsx`, `app/[tenant]/layout.tsx`, `app/[tenant]/page.tsx`, `app/[tenant]/blog/`, `app/[tenant]/resources/`, `app/[tenant]/tags/[tag]/` |
| Lib        | `lib/tenants.ts`, `lib/content.ts`, `lib/related.ts`, `lib/seed.ts`, `lib/markdown.ts` |
| Components | `components/tenant/` (TenantShell, TenantNav, Hero), `components/content/` (ContentCard, TagChips, SearchBox, RelatedContentGrid, InlineRecommendationsBlock, MarkdownContent) |
| Scripts    | `scripts/seed-tenant.ts`, `scripts/ingest-content.ts` |
| Content    | `demo-assets/<tenant>/` (config.json, seed.json, blog/*.md, resources/*.md); drop zone: `J77Output/<tenant>/*.zip` and loose files |
| Static assets | `public/<tenant>/images/` (images from ingest) |

## Deploying to Cloudflare (demo.j77.ai)

The app is built as a **static export** (`out/`) so it runs on Cloudflare Pages with no Node runtime.

1. In [Cloudflare Dashboard](https://dash.cloudflare.com) go to **Pages** → **Create a project** → **Connect to Git** (e.g. GitHub repo `southu/j77demo`).
2. **Build configuration:**
   - **Framework preset:** Next.js (Static HTML Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Root directory:** (leave blank if repo root is the app)
3. Add **Environment variables** if needed (none required for static content).
4. After the first deploy, go to **Custom domains** and add **demo.j77.ai**. In your DNS (where j77.ai is managed), add a CNAME: `demo` → `your-project.pages.dev` (or the URL Cloudflare shows).

Each push to the connected branch will trigger a new build and deploy. Run `npm run ingest` and/or `npm run seed` locally (or in CI) before pushing so `demo-assets/` and `public/` are up to date.

## Disclaimer

Demo site. Content is generated/summarized for demonstration purposes. No trademarked logos or assets are used unless explicitly provided in `demo-assets`.
