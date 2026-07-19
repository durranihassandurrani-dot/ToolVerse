import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ToolVerse — 100+ Free Online Tools for Everyone",
  description: "Free online tools: calculators, converters, generators, formatters, image tools, PDF tools, and more. No sign-up required. Fast, private, and works in your browser.",
  keywords: ["online tools", "free tools", "calculator", "converter", "generator", "formatter", "image tools", "PDF tools", "color tools", "developer tools"],
  authors: [{ name: "ToolVerse" }],
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" },
  openGraph: {
    title: "ToolVerse — 100+ Free Online Tools for Everyone",
    description: "Free online tools: calculators, converters, generators, formatters, image tools, PDF tools, and more.",
    siteName: "ToolVerse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolVerse — 100+ Free Online Tools for Everyone",
    description: "Free online tools: calculators, converters, generators, formatters, image tools, PDF tools, and more.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "ToolVerse",
            "url": "https://toolverse.app",
            "description": "100+ Free Online Tools for Everyone",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "featureList": ["Calculators", "Converters", "Generators", "Developer Tools", "Image Tools", "PDF Tools", "Color Tools", "Text Tools"]
          })
        }} />
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5504383665354221"
     crossorigin="anonymous"></script>
        <script async="async" data-cfasync="false" src="https://pl30429650.effectivecpmnetwork.com/4b88dacd815486ba632aa165808e2641/invoke.js"></script>
<div id="container-4b88dacd815486ba632aa165808e2641"></div>
  <script dangerouslySetInnerHTML={{__html: `
  atOptions = {
    'key' : '98caa31a379d552f9f7db3fb199ada06',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
`}} />
<script src="https://www.highperformanceformat.com/98caa31a379d552f9f7db3

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
