// Anchor styled as a button. Two variants (solid / ghost) and two sizes.
type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

const base =
  "inline-flex items-center justify-center rounded-lg font-semibold transition " +
  "hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal";

const variants = {
  solid: "bg-teal text-white hover:bg-teal-dark",
  ghost: "border-[1.5px] border-line bg-transparent text-navy hover:border-teal hover:bg-soft",
};

const sizes = {
  md: "px-6 py-3 text-[15px]",
  lg: "px-8 py-4 text-[17px]",
};

export default function Button({
  href,
  children,
  variant = "solid",
  size = "md",
  className = "",
}: Props) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </a>
  );
}
