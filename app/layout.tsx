import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export const metadata: Metadata = {
  title: {
    template: "%s | Universal Status",
    default: "Universal Status"
  },
  description: "Set your status on many platforms at once.",
  keywords: ["Universal Status", "status", "universal", "share", "status.cafe", "slack", "github"],
  metadataBase: new URL("https://status.novatea.dev"),
  openGraph: {
    url: "https://status.novatea.dev",
    siteName: "Universal Status",
    locale: "en_US",
    type: "website"
  }
};

const arimo = Arimo({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${arimo.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
