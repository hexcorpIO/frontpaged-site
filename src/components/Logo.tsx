// Brand lockup: the Frontpaged icon mark (F as the #1 search result) + "Frontpaged.io" wordmark.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-extrabold tracking-tight text-navy ${className}`}
    >
      <svg
        viewBox="0 0 512 512"
        role="img"
        aria-hidden="true"
        className="h-[1.25em] w-[1.25em] shrink-0"
      >
        <defs>
          <linearGradient id="fpLogoBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1b2f4d" />
            <stop offset="1" stopColor="#13233c" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="512" height="512" rx="72" fill="url(#fpLogoBg)" />
        <rect x="168" y="150" width="58" height="222" rx="16" fill="#ffffff" />
        <rect x="168" y="150" width="196" height="58" rx="16" fill="#33a1a1" />
        <rect x="168" y="256" width="156" height="58" rx="16" fill="#ffffff" />
        <rect x="168" y="392" width="120" height="14" rx="7" fill="#ffffff" opacity="0.18" />
        <rect x="304" y="392" width="40" height="14" rx="7" fill="#33a1a1" opacity="0.45" />
      </svg>
      <span>
        Frontpaged<span className="font-semibold text-teal">.io</span>
      </span>
    </span>
  );
}
