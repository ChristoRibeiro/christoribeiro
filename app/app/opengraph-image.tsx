import { ImageResponse } from "next/og";

export const alt = "Christophe Ribeiro — Entrepreneur & Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dynamic Open Graph / social preview image, on-brand with the site's dark palette.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0d0d10",
          color: "#ededf0",
          padding: 88,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, color: "#82828b", letterSpacing: 1 }}>
          christoribeiro.com
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            marginTop: 28,
            letterSpacing: -2,
          }}
        >
          Christophe Ribeiro
        </div>
        <div style={{ fontSize: 44, color: "#c7c7ce", marginTop: 10 }}>
          {"Entrepreneur & Software Engineer"}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#82828b",
            marginTop: 44,
            maxWidth: 880,
            lineHeight: 1.4,
          }}
        >
          Currently building a portfolio of simple but powerful B2B products.
        </div>
      </div>
    ),
    { ...size },
  );
}
