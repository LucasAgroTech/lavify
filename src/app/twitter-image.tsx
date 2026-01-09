import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Lavify - Encontre o Melhor Lava Jato";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
            display: "flex",
          }}
        />

        {/* Logo/Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            marginBottom: 32,
            boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)",
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 32 32"
            fill="none"
            style={{ display: "flex" }}
          >
            <path
              d="M16 6C16 6 10 13 10 18C10 21.314 12.686 24 16 24C19.314 24 22 21.314 22 18C22 13 16 6 16 6Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            marginBottom: 16,
            letterSpacing: "-2px",
          }}
        >
          Lavify
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#94a3b8",
            marginBottom: 40,
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Seu carro brilhando em minutos 🚗✨
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "white",
            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            padding: "16px 40px",
            borderRadius: 16,
            fontWeight: 600,
          }}
        >
          Agende sua lavagem agora
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            fontSize: 20,
            color: "#64748b",
          }}
        >
          www.lavify.com.br
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}





