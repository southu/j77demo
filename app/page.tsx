import Link from "next/link";

const features = [
  {
    num: "01",
    title: "Built for People and AI",
    desc: "Great content has to succeed on two stages: human readers who want clear, practical insights — and AI systems that reward structure, authority, and relevance. This strategy architects content to satisfy both.",
  },
  {
    num: "02",
    title: "Clear Expertise, Real Needs",
    desc: "Every article directly answers the actual questions people search for. Real-world problems with concrete, framework-driven explanations that resonate with users and search engines alike.",
  },
  {
    num: "03",
    title: "Structured for Maximum Impact",
    desc: "Clear section headings, concise summaries, and logical frameworks — content that gets indexed effectively, helps AI understand context, and makes complex topics easy for humans to absorb.",
  },
  {
    num: "04",
    title: "Builds Trust — Not Buzz",
    desc: "Honesty, expertise, and usefulness over hype. Content that earns trust with informed readers — improving engagement and long-term authority.",
  },
  {
    num: "05",
    title: "Connected Knowledge Hub",
    desc: "An interconnected content ecosystem where every piece reinforces the others. Linked articles, frameworks, and resources create depth that search engines and readers reward.",
  },
  {
    num: "06",
    title: "Optimized for Modern Search",
    desc: "Clear answers, structured logic, and real expertise — content that performs well today and stays ahead of tomorrow's AI-powered search algorithms.",
  },
];

const pillItems = [
  "Useful to readers",
  "Friendly to search & AI",
  "Structured for discovery",
  "Trust-building, not promotional",
  "Interconnected ecosystem",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-stone-200/40 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight text-indigo-600">J77</span>
          <a
            href="mailto:hello@j77.ai"
            className="rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Get in touch
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <span className="mb-6 inline-block rounded-full bg-white/15 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white/90">
            Modern Content Strategy
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl leading-[1.1]">
            This Isn&apos;t Just Content.<br />
            <span className="text-white/80">It&apos;s Content That Works.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-white/70 leading-relaxed md:text-xl">
            Transform simple articles into a sustainable competitive advantage — one that attracts attention, earns trust, and amplifies your brand without gimmicks.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:hello@j77.ai"
              className="rounded-full bg-white px-8 py-3 text-sm font-bold text-indigo-700 shadow-lg shadow-indigo-500/20 transition hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Start a conversation
            </a>
          </div>
        </div>
        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── Why Section ── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Why This Strategy</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
            Content designed to perform
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-500 leading-relaxed">
            In today&apos;s world, great content has to succeed on two very different stages — human readers and AI systems. This strategy doesn&apos;t guess what works. It architects content to satisfy both.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.num}
              className="group rounded-2xl border border-stone-200/80 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-200"
            >
              <span className="text-3xl font-extrabold text-indigo-500/30 transition-colors group-hover:text-indigo-500/60">
                {f.num}
              </span>
              <h3 className="mt-3 text-base font-bold text-stone-900">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="border-y border-stone-200/60 bg-stone-50/80">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Designed to be</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {pillItems.map((item) => (
              <span
                key={item}
                className="rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-600 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-xl text-stone-500 leading-relaxed">
            A single blog post might answer a question — but an interconnected content ecosystem establishes authority. Each piece reinforces the others, creating depth that search engines and readers reward.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          Ready to build content<br />that actually works?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-stone-500">
          Stop guessing. Start building a sustainable competitive advantage with content designed for people and AI.
        </p>
        <div className="mt-10">
          <a
            href="mailto:hello@j77.ai"
            className="inline-flex items-center rounded-full bg-stone-900 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800 hover:-translate-y-0.5 shadow-lg"
          >
            Get in touch →
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-stone-200/60 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <span className="text-sm font-bold text-indigo-600">J77</span>
          <p className="text-xs text-stone-400">
            &copy; {new Date().getFullYear()} J77. Content strategy for the AI era.
          </p>
        </div>
      </footer>
    </div>
  );
}
