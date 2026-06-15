// Wordmark: an "F" in a rounded teal square, "Frontpaged", and ".io" in teal.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-extrabold tracking-tight text-navy ${className}`}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-[1.05em] w-[1.05em] -rotate-3 items-center justify-center rounded-md bg-teal text-[0.6em] font-extrabold text-white"
      >
        F
      </span>
      <span>
        Frontpaged<span className="font-semibold text-teal">.io</span>
      </span>
    </span>
  );
}
