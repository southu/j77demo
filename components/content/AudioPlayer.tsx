export function AudioPlayer({ src }: { src: string }) {
  return (
    <div className="mb-8 rounded-xl border border-stone-200 bg-stone-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
        Listen to this article
      </div>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio controls preload="metadata" className="w-full">
        <source src={src} type="audio/mpeg" />
      </audio>
    </div>
  );
}
