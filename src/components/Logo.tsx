import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  /**
   * sm = 80px | md = 120px | lg = 180px
   * Use "login" for the responsive login-page treatment (140px mobile / 180px desktop).
   */
  size?: "sm" | "md" | "lg" | "login";
  className?: string;
  clickable?: boolean;
};

const sizeClass: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "w-[80px]",
  md: "w-[120px]",
  lg: "w-[180px]",
  login: "w-[140px] sm:w-[180px]",
};

export function Logo({ size = "md", className = "", clickable = true }: LogoProps) {
  const widthClass = sizeClass[size];
  const combined = [widthClass, className].filter(Boolean).join(" ");

  const img = (
    <Image
      src="/logo/MW-logo-trans_1754045676555.png"
      alt="Moving Walls"
      width={180}
      height={180}
      className="h-auto w-full object-contain"
      priority
    />
  );

  if (!clickable) return <div className={combined}>{img}</div>;

  return (
    <Link href="/" className={`block ${combined}`} aria-label="Go to homepage">
      {img}
    </Link>
  );
}
