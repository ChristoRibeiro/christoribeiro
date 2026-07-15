import { ImageResponse } from "next/og";
import { photoDataUri } from "@/lib/photo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon: the photo, square (iOS rounds it itself).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoDataUri()}
          width={180}
          height={180}
          style={{ objectFit: "cover" }}
          alt=""
        />
      </div>
    ),
    { ...size },
  );
}
