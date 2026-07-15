import { ImageResponse } from "next/og";
import { photoDataUri } from "@/lib/photo";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Favicon: the round avatar photo.
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoDataUri()}
          width={64}
          height={64}
          style={{ objectFit: "cover", borderRadius: "50%" }}
          alt=""
        />
      </div>
    ),
    { ...size },
  );
}
