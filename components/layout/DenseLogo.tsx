// Uses the actual dense brand logo image
// image2 (dense-logo-with-text.jpeg) shows "by dense" together
// We use image1 (dense-logo.jpeg) as the box and add "by" text ourselves

interface DenseLogoProps {
  size?: number;
  // footer variant uses white bg version — but we only have dark version so invert for footer
  variant?: "default" | "footer";
}

export default function DenseLogo({ size = 32, variant = "default" }: DenseLogoProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{
        fontSize: size * 0.5,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
        color: variant === "footer" ? "white" : "inherit",
      }}>
        by
      </span>
      {/* Use the actual brand logo image */}
      <img
        src="/dense-logo.jpeg"
        alt="dense"
        style={{
          height: size,
          width: size * 1.35,
          objectFit: "cover",
          objectPosition: "center",
          borderRadius: size * 0.22,
          display: "block",
          flexShrink: 0,
          filter: variant === "footer" ? "invert(1)" : "none",
        }}
      />
    </span>
  );
}
