import Link from "next/link";

const sizeClass = {
  sm: "w-[80px]",
  md: "w-[120px]",
  lg: "w-[180px]",
};

type LogoProps = {
  /** Fixed size shorthand. Ignored when className provides a w- class. */
  size?: "sm" | "md" | "lg";
  /** Tailwind classes for the container. Providing a w-* here overrides size. */
  className?: string;
  clickable?: boolean;
};

export function Logo({ size = "md", className = "", clickable = true }: LogoProps) {
  // If caller provides any width class (w-*), don't add the size-based one.
  const hasWidthClass = /\bw-/.test(className);
  const widthClass = hasWidthClass ? "" : sizeClass[size];
  const combined = ["shrink-0", widthClass, className].filter(Boolean).join(" ");

  const img = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/logo/MW-logo-trans_1754045676555.png"
      alt="Moving Walls"
      className="h-auto w-full object-contain"
    />
  );

  if (!clickable) return <div className={combined}>{img}</div>;

  return (
    <Link href="/" className={`block ${combined}`} aria-label="Go to homepage">
      {img}
    </Link>
  );
}
