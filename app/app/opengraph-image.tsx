import { ImageResponse } from "next/og";
import { photoDataUri } from "@/lib/photo";

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
          padding: 96,
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoDataUri()}
          width={168}
          height={168}
          style={{ objectFit: "cover", borderRadius: "50%", marginBottom: 40 }}
          alt=""
        />
        <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -2 }}>
          Christophe Ribeiro
        </div>
        <div style={{ fontSize: 46, color: "#c7c7ce", marginTop: 12 }}>
          {"Entrepreneur & Software Engineer"}
        </div>
      </div>
    ),
    { ...size },
  );
}
