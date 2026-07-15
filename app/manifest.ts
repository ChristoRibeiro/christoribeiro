import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Christophe Ribeiro",
    short_name: "Christophe",
    description:
      "Currently building a portfolio of simple but powerful B2B products.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d10",
    theme_color: "#0d0d10",
    icons: [{ src: "/me.jpg", sizes: "any", type: "image/jpeg" }],
  };
}
