import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://christoribeiro.com";
const TITLE = "Christophe Ribeiro — Entrepreneur & Software Engineer";
const DESCRIPTION =
  "Currently building a portfolio of simple but powerful B2B products.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Christophe Ribeiro",
  },
  description: DESCRIPTION,
  applicationName: "Christophe Ribeiro",
  authors: [{ name: "Christophe Ribeiro", url: SITE_URL }],
  creator: "Christophe Ribeiro",
  keywords: [
    "Christophe Ribeiro",
    "entrepreneur",
    "software engineer",
    "founder",
    "B2B",
    "SaaS",
    "indie hacker",
    "Foreach",
    "Eanscan",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Christophe Ribeiro",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@christoribeiro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d10" },
  ],
};

// Runs before paint so the theme is set with no flash of the wrong colors.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
