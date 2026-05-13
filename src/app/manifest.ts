import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Winterset Law Group",
    short_name: "WLG",
    description: "Resolve your Ohio state debt. Set up a payment plan, file a dispute, or schedule a call.",
    start_url: "/",
    display: "standalone",
    background_color: "#1B2B4B",
    theme_color: "#1B2B4B",
    orientation: "portrait",
    categories: ["finance", "legal"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcuts: [
      {
        name: "Get Started",
        url: "/get-started",
        description: "Set up a payment plan or file a dispute",
      },
      {
        name: "Schedule a Call",
        url: "/schedule",
        description: "Book a call with an attorney",
      },
    ],
  };
}
