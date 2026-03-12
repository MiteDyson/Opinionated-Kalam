import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}

const sizeMap = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-5xl",
};

export default function Logo({ size = "md", inverted = false }: LogoProps) {
  return (
    <Link href="/" className="flex flex-col items-center gap-1 group">
      <span
        className={`font-serif font-normal leading-none tracking-tight transition-opacity group-hover:opacity-80 ${sizeMap[size]}`}
        style={{ color: inverted ? "white" : "var(--text-main)" }}
      >
        Opinionated Kalam
      </span>
      <span
        className="flex items-center gap-1.5 font-sans text-[11px]"
        style={{ color: inverted ? "#9ca3af" : "var(--text-muted)" }}
      >
        by{" "}
        <span
          className="inline-block px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider"
          style={{
            backgroundColor: inverted ? "white" : "var(--text-main)",
            color: inverted ? "black" : "var(--bg)",
          }}
        >
          dense
        </span>
      </span>
    </Link>
  );
}
