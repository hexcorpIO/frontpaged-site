// Thin, single-weight line icons (24x24, inherit color via currentColor).
// Used to add tasteful visual texture to cards/steps without emoji.

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SearchIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className} width="24" height="24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function SparkleIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className} width="24" height="24" aria-hidden="true">
      <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
      <path d="M18.5 4v3M20 5.5h-3" />
    </svg>
  );
}

export function PinIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className} width="24" height="24" aria-hidden="true">
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function TrendingUpIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className} width="24" height="24" aria-hidden="true">
      <path d="M3 17 9.5 10.5l4 4L21 7" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

export function FileIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className} width="24" height="24" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  );
}

export function CheckIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className} width="24" height="24" aria-hidden="true">
      <path d="m4.5 12.5 4.5 4.5 10.5-11" />
    </svg>
  );
}
