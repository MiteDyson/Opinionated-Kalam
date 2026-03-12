interface DenseLogoProps {
  size?: number;
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
      <img
        src="/logo.png"
        alt="dense"
        style={{
          height: size,
          width: size,
          objectFit: "cover",
          borderRadius: size * 0.18,
          display: "block",
          flexShrink: 0,
        }}
      />
    </span>
  );
}
