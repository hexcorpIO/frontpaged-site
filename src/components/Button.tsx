// Anchor styled as a button. Two variants (solid / ghost) and two sizes.
type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  size?: "md" | "lg";
  className?: string;
  /**
   * Stable analytics identifier. Every Button is a conversion action of some
   * kind, so leaving this off means the click is reported under an ID derived
   * from its label — which silently changes the day someone rewrites the copy.
   * Set it wherever the number is one we report on.
   */
  trackId?: string;
};

const base =
  "inline-flex items-center justify-center rounded-full font-semibold transition " +
  "hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal";

const variants = {
  solid: "bg-teal text-white hover:bg-teal-dark",
  ghost: "border border-warm-line bg-transparent text-navy hover:border-teal hover:bg-soft",
};

const sizes = {
  md: "px-7 py-3 text-[15px]",
  lg: "px-9 py-4 text-[17px]",
};

export default function Button({
  href,
  children,
  variant = "solid",
  size = "md",
  className = "",
  trackId,
}: Props) {
  return (
    <a
      href={href}
      data-track-id={trackId}
      data-track-type="cta"
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}
