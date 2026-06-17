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

export function StarIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className} width="24" height="24" aria-hidden="true">
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />
    </svg>
  );
}

export function ChatIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className} width="24" height="24" aria-hidden="true">
      <path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.3-4A7.5 7.5 0 1 1 20 11.5Z" />
      <path d="M9 11h.01M12 11h.01M15 11h.01" />
    </svg>
  );
}

export function SlidersIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className} width="24" height="24" aria-hidden="true">
      <path d="M5 21V14M5 10V3M12 21V12M12 8V3M19 21V16M19 12V3" />
      <path d="M2.5 14h5M9.5 8h5M16.5 16h5" />
    </svg>
  );
}

export function CodeIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className} width="24" height="24" aria-hidden="true">
      <path d="m8 9-3 3 3 3M16 9l3 3-3 3M13.5 7l-3 10" />
    </svg>
  );
}

export function ImageIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className} width="24" height="24" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4.5 17 4.5-4.5 4 4 3-3 3.5 3.5" />
    </svg>
  );
}
