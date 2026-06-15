// Centered max-width wrapper used by every section (mirrors the `.wrap` in the mockup).
export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1080px] px-6 ${className}`}>
      {children}
    </div>
  );
}
